"use client";

import { getThreadById } from "@/http/api-client";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DownloadIcon, TablePropertiesIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function MDXTable(props: React.HTMLAttributes<HTMLTableElement>) {
  const params = useParams();

  const handleDownloadTable = (type: string, content: React.ReactNode) => {
    if (!content) return;

    let columnsAmount = 0;
    let rowsAmount = 0;

    const tableData = React.Children.map(content, (child) => {
      if (!React.isValidElement(child)) return [];

      return React.Children.map(
        child.props.children,
        (row: React.ReactNode) => {
          if (!React.isValidElement(row)) return [];

          const cells = React.Children.map(
            row.props.children,
            (cell: React.ReactNode) => {
              if (!React.isValidElement(cell)) return "";

              // Handle nested content
              const cellContent: React.ReactNode = cell.props.children;

              // Handle React elements with nested structure
              if (React.isValidElement(cellContent)) {
                return cellContent.props?.children || "";
              }

              // Handle arrays of React elements or mixed content
              if (Array.isArray(cellContent)) {
                return cellContent
                  .map((item: React.ReactNode) => {
                    if (React.isValidElement(item)) {
                      return item.props?.children || "";
                    }
                    return item?.toString() || "";
                  })
                  .join("");
              }

              // Handle direct string content
              if (
                cellContent &&
                typeof cellContent === "object" &&
                "props" in cellContent
              ) {
                return cellContent.props?.children || "";
              }

              return cellContent?.toString() || "";
            },
          );

          // Update columns amount based on the first row
          if (rowsAmount === 0) {
            columnsAmount = cells?.length || 0;
          }
          rowsAmount++;

          return cells;
        },
      );
    }) as unknown as string[];

    // Convert array to CSV format
    function arrayToCSV(data: string[]) {
      // Ensure data is an array
      if (!Array.isArray(data) || !data.length) {
        console.warn("Invalid data format:", data);
        return "";
      }

      const rows: string[][] = [];

      // First row is headers
      rows.push(data.slice(0, columnsAmount));

      // Process remaining data into rows
      for (let i = columnsAmount; i < data.length; i += columnsAmount) {
        const row = data.slice(i, i + columnsAmount);
        if (row.length === columnsAmount) {
          rows.push(row);
        }
      }

      // Validate row count matches rowsAmount
      if (rows.length !== rowsAmount) {
        console.warn(
          `Row count mismatch. Expected ${rowsAmount}, got ${rows.length}`,
        );
      }

      return rows
        .map((row) => {
          return row
            .map((cell) => {
              if (cell === null || cell === undefined) return '""';

              const cellStr = String(cell);
              const escaped = cellStr.replace(/"/g, '""');

              if (
                escaped.includes(",") ||
                escaped.includes('"') ||
                escaped.includes("\n")
              ) {
                return `"${escaped}"`;
              }
              return escaped;
            })
            .join(",");
        })
        .join("\n");
    }

    // Convert array to Excel-compatible TSV format
    function arrayToTSV(data: string[]) {
      // Ensure data is an array
      if (!Array.isArray(data) || !data.length) {
        console.warn("Invalid data format:", data);
        return "";
      }

      const rows: string[][] = [];

      // First row is headers
      rows.push(data.slice(0, columnsAmount));

      // Process remaining data into rows
      for (let i = columnsAmount; i < data.length; i += columnsAmount) {
        const row = data.slice(i, i + columnsAmount);
        if (row.length === columnsAmount) {
          rows.push(row);
        }
      }

      return rows.map((row) => row.join("\t")).join("\n");
    }

    function generatePDF(data: string[]) {
      const doc = new jsPDF({
        unit: "pt",
        format: "a4",
        putOnlyUsedFonts: true,
      });

      const headers = data.slice(0, columnsAmount);
      const rows: string[][] = [];
      for (let i = columnsAmount; i < data.length; i += columnsAmount) {
        rows.push(data.slice(i, i + columnsAmount));
      }

      (doc as any).autoTable({
        head: [headers],
        body: rows,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fontSize: 8,
        },
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        showHead: "firstPage",
      });

      return doc.output("arraybuffer");
    }

    function getFileExtension(mimeType: string) {
      switch (mimeType) {
        case "text/csv":
          return "csv";
        case "application/vnd.ms-excel":
          return "xls";
        case "application/pdf":
          return "pdf";
        default:
          return "";
      }
    }

    // Create and trigger download
    async function downloadFile(
      content: string | Uint8Array,
      mimeType: string,
    ) {
      const openaiThreadId = params.openaiThreadId as string;
      const thread = await getThreadById(openaiThreadId);
      const fileExtension = getFileExtension(mimeType);
      const date = new Date().toLocaleString("pt-BR").replace(/[/:,\s]/g, "-");
      const filename = `ACME - ${thread.title} - ${date}.${fileExtension}`;

      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }

    switch (type) {
      case "csv":
        downloadFile(arrayToCSV(tableData), "text/csv");
        break;
      case "excel":
        downloadFile(arrayToTSV(tableData), "application/vnd.ms-excel");
        break;
      case "pdf": {
        const pdfContent = generatePDF(tableData);
        downloadFile(new Uint8Array(pdfContent), "application/pdf");
        break;
      }
    }
  };

  return (
    <div className="max-w-[300px] md:max-w-[620px] sm:max-w-[600px] flex flex-col overflow-x-auto rounded-t-lg">
      <div className="flex items-center justify-between w-full bg-background border border-muted p-2 rounded-t-lg">
        <Button variant="ghost" disabled className="p-2 h-fit">
          <TablePropertiesIcon className="size-4 text-muted-foreground" />
        </Button>
        <TooltipProvider>
          <Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="p-2 h-fit">
                    <DownloadIcon className="size-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Baixar tabela</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleDownloadTable("csv", props.children)}
                >
                  CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDownloadTable("excel", props.children)}
                >
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDownloadTable("pdf", props.children)}
                >
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>Baixar tabela</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="overflow-x-auto w-full">
        <table
          className="my-0 divide-y divide-muted border border-muted rounded-lg w-full"
          {...props}
        />
      </div>
    </div>
  );
}
