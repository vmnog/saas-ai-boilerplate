"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useWindowWidth } from "@/hooks/use-window-width";
import {
  deleteUpload,
  getLimits,
  sendMessageToThread,
  transcribeAudio,
  uploadAttachment,
} from "@/http/api-client";
import type { Message, Upload } from "@/http/schemas";
import { cn } from "@/lib/cn";
import { dayjs } from "@/lib/dayjs";
import { LoaderIcon, MicIcon, PaperclipIcon, PauseIcon, SendIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useRef, useState } from "react";
import { ReachedMessageLimitAlert } from "./reached-message-limit";
import { UploadAttachments } from "./upload-attachments";

const LOCAL_STORAGE_KEYS = {
  PENDING_MESSAGE: "pending-first-user-message",
  UPLOADED_FILES: "uploaded-files",
} as const;

interface SendMessageProps {
  openaiThreadId: string | null;
  onAddMessage: (message: Message) => Promise<void>;
  onUpdateLastMessage: (content: string) => Promise<void>;
  onThreadCompleted: () => Promise<void>;
  onAddMessageFails: () => Promise<void>;
}

interface MessageData {
  messageText: string;
  attachmentFiles: Array<{ id: string; fileId: string }>;
  uploadedFiles: Upload[];
}

export function SendMessage({
  openaiThreadId,
  onAddMessage,
  onUpdateLastMessage,
  onThreadCompleted,
  onAddMessageFails,
}: SendMessageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<{
    [key: string]: boolean;
  }>({});
  const [uploadedFiles, setUploadedFiles] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [exceededMessageLimit, setExceededMessageLimit] = useState(false);
  const { toast } = useToast();
  const [start, setStart] = useQueryState("start");
  const [text, setText] = useQueryState("text");
  const wasMessageSentRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const windowWidth = useWindowWidth();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscriptionLoading, setIsTranscriptionLoading] = useState(false);

  // Audio recording related refs and state
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isRecording) {
      const intervalId = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isRecording]);

  // TODO: pass this to use a webhook that sends a signal once user reaches limits
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const limits = await getLimits();
        setExceededMessageLimit(
          !!limits.resetAt && dayjs(limits.resetAt).isAfter(dayjs()),
        );
      } catch (error) {
        console.error("Error fetching limits:", error);
      }
    };

    fetchLimits();
    const intervalId = setInterval(fetchLimits, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (textareaRef.current && message) {
      handleTextAreaHeight({ resetHeight: false });
    }
  }, [message]);

  useEffect(() => {
    const isNewThread = start === "true";
    if (isNewThread && openaiThreadId && !wasMessageSentRef.current) {
      setStart(null, { shallow: true }).then(handleNewThreadMessage);
    }

    if (!isNewThread && !openaiThreadId) {
      clearLocalStorage();
    }

    if (text) {
      setMessage(text);
      setText(null);
    }

    return () => {
      wasMessageSentRef.current = false;
    };
  }, [openaiThreadId, start, text, setText, setStart]);

  const handleNewChat = () => {
    window.location.href = "/chat";
  };

  const isUploading = useMemo(
    () => Object.values(uploadingFiles).some((isUploading) => isUploading),
    [uploadingFiles],
  );

  const isSubmitDisabled = useMemo(
    () => isLoading || isUploading || exceededMessageLimit,
    [isLoading, isUploading, exceededMessageLimit],
  );

  const isUploadFileDisabled = useMemo(
    () => isUploading || exceededMessageLimit,
    [isUploading, exceededMessageLimit],
  );

  function getLocalStorageData(): MessageData {
    const pendingMessage = localStorage.getItem(
      LOCAL_STORAGE_KEYS.PENDING_MESSAGE,
    );
    const storedFiles = localStorage.getItem(LOCAL_STORAGE_KEYS.UPLOADED_FILES);
    const uploadFilesStateOrLocalStorage =
      uploadedFiles.length > 0
        ? uploadedFiles
        : storedFiles
          ? JSON.parse(storedFiles)
          : [];

    return {
      messageText: message.trim() || pendingMessage?.trim() || "",
      attachmentFiles: uploadFilesStateOrLocalStorage.map(({ id, file }) => ({
        id,
        fileId: file.id,
      })),
      uploadedFiles: uploadFilesStateOrLocalStorage,
    };
  }

  function validateMessage(messageText: string): boolean {
    if (!messageText) {
      toast({
        variant: "destructive",
        title: "Ops! Não foi possível enviar a mensagem.",
        description: "A mensagem não pode estar vazia.",
      });
      return false;
    }
    return true;
  }

  function createMessage(
    role: string,
    text: string,
    uploads: Upload[],
  ): Message {
    return {
      id: crypto.randomUUID(),
      role,
      text,
      createdAt: new Date().toISOString(),
      attachments: uploads.map((upload) => ({
        id: upload.id,
        filename: upload.file.filename,
        mimetype: upload.file.mimetype,
        bytes: upload.file.bytes,
        createdAt: upload.createdAt,
      })),
    };
  }

  function saveToLocalStorage(messageText: string, files: Upload[]) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PENDING_MESSAGE, messageText);
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.UPLOADED_FILES,
      JSON.stringify(files),
    );
  }

  function clearLocalStorage() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.PENDING_MESSAGE);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.UPLOADED_FILES);
  }

  async function handleMessageSend(messageData: MessageData) {
    if (!openaiThreadId) {
      saveToLocalStorage(messageData.messageText, messageData.uploadedFiles);
      const userMessage = createMessage(
        "user",
        messageData.messageText,
        messageData.uploadedFiles,
      );
      await onAddMessage(userMessage);
      return;
    }

    const userMessage = createMessage(
      "user",
      messageData.messageText,
      messageData.uploadedFiles,
    );
    await onAddMessage(userMessage);

    const assistantMessage = createMessage("assistant", "", []);
    await onAddMessage(assistantMessage);

    resetForm();

    const response = await sendMessageToThread(openaiThreadId, {
      content: messageData.messageText,
      attachments: messageData.attachmentFiles,
    });

    if (response && !response.ok) {
      throw new Error("Ocorreu um erro ao enviar a mensagem");
    }

    if (!response) {
      throw new Error("Resposta não encontrada ao enviar a mensagem");
    }

    clearLocalStorage();

    await processStreamResponse(response);
  }

  const handleSendMessage = async () => {
    if (wasMessageSentRef.current) return;
    wasMessageSentRef.current = true;

    const messageData = getLocalStorageData();
    if (!validateMessage(messageData.messageText)) return;

    setIsLoading(true);
    try {
      await handleMessageSend(messageData);
    } catch (error) {
      await handleSendError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewThreadMessage = async () => {
    if (wasMessageSentRef.current) return;
    wasMessageSentRef.current = true;

    const messageData = getLocalStorageData();
    if (!validateMessage(messageData.messageText)) return;

    setIsLoading(true);
    try {
      saveToLocalStorage(messageData.messageText, messageData.uploadedFiles);
      const userMessage = createMessage(
        "user",
        messageData.messageText,
        messageData.uploadedFiles,
      );
      await onAddMessage(userMessage);

      if (openaiThreadId) {
        const assistantMessage = createMessage("assistant", "", []);
        await onAddMessage(assistantMessage);

        const response = await sendMessageToThread(openaiThreadId, {
          content: messageData.messageText,
          attachments: messageData.attachmentFiles,
        });

        if (!response?.ok) {
          throw new Error("Ocorreu um erro ao enviar a mensagem");
        }

        clearLocalStorage();
        await processStreamResponse(response);
      }
    } catch (error) {
      await handleSendError(error);
    } finally {
      setIsLoading(false);
      wasMessageSentRef.current = false;
    }
  };

  function resetForm() {
    setMessage("");
    setSelectedFiles([]);
    setUploadedFiles([]);
  }

  async function handleSendError(error: unknown) {
    wasMessageSentRef.current = false;
    toast({
      variant: "destructive",
      title: "Ops! Não foi possível enviar a mensagem.",
      description:
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao enviar a mensagem.",
    });
    await onAddMessageFails();
    console.error("Error sending message:", error);
  }

  const processStreamResponse = async (response: Response) => {
    if (!response.body) {
      throw new Error("The response body is empty.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let fullContent = "";

    const processBuffer = async (buffer: string) => {
      try {
        const parsed = JSON.parse(buffer);

        switch (parsed.event) {
          case "thread.message.delta": {
            const deltaContent = parsed.data.delta.content
              .map((item: { text: { value: string } }) => item.text.value)
              .join("");
            fullContent += deltaContent;
            await onUpdateLastMessage(fullContent);
            break;
          }
          case "thread.run.completed": {
            wasMessageSentRef.current = false;
            await onThreadCompleted();
            break;
          }
        }
      } catch (error) {
        console.error("Error parsing buffer:", error);
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      while (true) {
        const offset = buffer.indexOf("\n");
        if (offset >= 0) {
          processBuffer(buffer.substring(0, offset));
          buffer = buffer.slice(offset + 1);
        } else break;
      }
    }
  };

  const handleTextAreaHeight = ({ resetHeight }: { resetHeight: boolean }) => {
    if (!textareaRef.current) return;

    const style = getComputedStyle(textareaRef.current);
    const lineHeight = Number.parseInt(style.lineHeight);
    const padding =
      Number.parseInt(style.paddingTop) + Number.parseInt(style.paddingBottom);
    const minHeight = lineHeight + padding;
    const linerows = windowWidth > 768 ? 4 : 4;
    const maxHeight = minHeight * linerows;

    textareaRef.current.style.height = "auto";
    const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
    if (resetHeight) {
      textareaRef.current.style.height = `${60}px`;
    } else {
      textareaRef.current.style.height = `${newHeight}px`;
    }
    textareaRef.current.style.overflowY =
      newHeight === maxHeight ? "auto" : "hidden";
  };

  const handleTranscribeAudio = async (audio: Blob) => {
    const audioAsFile = new File([audio], "audio.wav", { type: "audio/wav" });
    const response = await transcribeAudio(audioAsFile);
    return response.text;
  };

  const handleFileUpload = async (file: File) => {
    try {
      const upload = await uploadAttachment(file);
      setUploadedFiles((prev) => [...prev, upload]);
      setUploadingFiles((prev) => ({ ...prev, [file.name]: false }));
    } catch (error) {
      console.error(`Failed to upload file: ${file.name}`, error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar arquivo",
        description: `Não foi possível carregar o arquivo ${file.name}.`,
      });
      setSelectedFiles((prev) => prev.filter((f) => f.name !== file.name));
      setUploadingFiles((prev) => {
        const { [file.name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files?.length) return;

    const newFiles = Array.from(files);
    const updatedFiles = selectedFiles.filter(
      (file) => !newFiles.some((newFile) => newFile.name === file.name),
    );

    setSelectedFiles([...newFiles, ...updatedFiles]);
    setUploadingFiles(
      // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
      newFiles.reduce((acc, file) => ({ ...acc, [file.name]: true }), {}),
    );

    await Promise.all(newFiles.map(handleFileUpload));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = async (fileName: string) => {
    const uploadToRemove = uploadedFiles.find(
      (file) => file.file.filename === fileName,
    );

    setSelectedFiles((prev) => prev.filter((file) => file.name !== fileName));
    setUploadedFiles((prev) =>
      prev.filter((file) => file.file.filename !== fileName),
    );
    setUploadingFiles((prev) => {
      const { [fileName]: _, ...rest } = prev;
      return rest;
    });

    if (!uploadToRemove?.id) return;

    try {
      await deleteUpload(uploadToRemove.id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao remover arquivo",
        description:
          "Não foi possível remover o arquivo. Mas não se preocupe, ele não será incluído na mensagem.",
      });
    }
  };

  async function handleToggleVoiceRecorder() {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        });

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setRecordingTime(0);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          variant: "destructive",
          title: "Erro ao acessar microfone",
          description: "Não foi possível acessar o microfone. Verifique as permissões do navegador.",
        });
      }
      return;
    }

    setIsTranscriptionLoading(true);
    setIsRecording(false);
    setRecordingTime(0);

    // Stop recording and process audio
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();

      // Wait for the final dataavailable event
      await new Promise<void>((resolve) => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.addEventListener('stop', () => {
            resolve();
          });
        } else {
          resolve();
        }
      });

      // Stop all tracks in the stream
      if (mediaRecorderRef.current.stream) {
        for (const track of mediaRecorderRef.current.stream.getTracks()) {
          track.stop();
        }
      }
    }

    try {
      // Create audio blob from chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

      // Get transcription
      const transcription = await handleTranscribeAudio(audioBlob);

      // Append transcription to current message
      setMessage(prev => {
        const separator = prev.trim() ? ' ' : '';
        return prev.trim() + separator + transcription;
      });

      // Focus textarea and adjust height
      if (textareaRef.current) {
        textareaRef.current.focus();
        handleTextAreaHeight({ resetHeight: false });
      }

      toast({
        title: "Transcrição concluída",
        description: "A transcrição foi concluída com sucesso.",
      });
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        variant: "destructive",
        title: "Erro na transcrição",
        description: "Não foi possível transcrever o áudio. Tente novamente.",
      });
    } finally {
      setIsTranscriptionLoading(false);
    }
  }

  return (
    <div className="w-full fixed left-0 bottom-0 bg-background px-4 z-10">
      <ReachedMessageLimitAlert hasReachedLimit={exceededMessageLimit} />
      <div className="max-w-2xl mx-auto">
        <Card className="border">
          <CardContent className="p-0">
            <div className="flex flex-col space-y-2">
              <UploadAttachments
                selectedFiles={selectedFiles}
                uploadingFiles={uploadingFiles}
                removeFile={removeFile}
              />
              <div className="p-3">
                <Textarea
                  ref={textareaRef}
                  rows={1}
                  placeholder="Digite uma mensagem..."
                  className="mb-3 flex-grow resize-none border-none shadow-none focus-visible:ring-0"
                  value={message}
                  onChange={(e) => {
                    // reseting textarea height
                    if (!e.target.value.trim()) {
                      if (textareaRef.current) textareaRef.current.value = "";
                      handleTextAreaHeight({ resetHeight: true });
                      setMessage("");
                    }
                    setMessage(e.target.value);
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (isSubmitDisabled) return;
                      handleSendMessage();
                      // reseting textarea height
                      handleTextAreaHeight({ resetHeight: true });
                    }
                  }}
                />
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            disabled={isTranscriptionLoading}
                            variant={isRecording ? "destructive" : "outline"}
                            className={cn(
                              "w-fit min-w-32 px-3 group",
                              isRecording && "animate-pulse",
                            )}
                            onClick={handleToggleVoiceRecorder}
                          >
                            {isTranscriptionLoading && (
                              <LoaderIcon className="size-4 animate-spin" />
                            )}

                            {!isTranscriptionLoading && (
                              <>
                                {isRecording ? (
                                  <PauseIcon className="min-w-6 min-h-6 rounded-full p-1 bg-transparent text-destructive-foreground" />
                                ) : (
                                  <MicIcon className="min-w-6 min-h-6 rounded-full p-1 bg-destructive text-destructive-foreground" />
                                )}
                                <span className="text-xs">
                                  {isRecording
                                    ? dayjs().minute(Math.floor(recordingTime / 60)).second(recordingTime % 60).format("mm:ss")
                                    : "Gravar voz"}
                                </span>
                              </>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-pretty w-48">
                          {isRecording
                            ? "Clique para parar de gravar"
                            : "Clique para gravar uma consulta e ter seu audio convertido em texto."}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            disabled={isUploadFileDisabled}
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            size="icon"
                            className="w-fit px-3"
                          >
                            <PaperclipIcon className="size-5" />
                            <span className="text-xs hidden sm:block">Anexar exames</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>Anexar Arquivos</span>{" "}
                          <span className="text-gray-400">
                            (Max. 5 arquivos, 10MB cada)
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <input
                    disabled={isUploadFileDisabled}
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="
                                            application/pdf,
                                            application/msword,
                                            application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                            application/vnd.openxmlformats-officedocument.presentationml.presentation,
                                            application/typescript,
                                            application/json,
                                            text/plain,
                                            text/markdown,
                                            text/javascript,
                                            text/css,
                                            text/html,
                                            text/x-c,
                                            text/x-c++,
                                            text/x-csharp,
                                            text/x-golang,
                                            text/x-java,
                                            text/x-php,
                                            text/x-python,
                                            text/x-script.python,
                                            text/x-ruby,
                                            text/x-tex
                                        "
                  />
                  <Button
                    type="submit"
                    onClick={() => handleSendMessage()}
                    disabled={isSubmitDisabled}
                  >
                    <SendIcon className="size-4" />
                    <span className="text-xs hidden sm:block">Enviar mensagem</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <span className="text-balance my-4 text-xs text-center text-gray-500 flex justify-center items-center">
          ACME pode cometer erros. Considere verificar informações
          importantes.
        </span>
      </div>

      <AlertDialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Iniciar Nova Conversa?</AlertDialogTitle>
          <AlertDialogHeader>
            <AlertDialogDescription>
              Você tem um rascunho em andamento. Deseja descartá-lo e criar uma
              nova conversa?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleNewChat}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
