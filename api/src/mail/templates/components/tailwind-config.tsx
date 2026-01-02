import { Tailwind } from '@react-email/tailwind'
import type { ReactNode } from 'react'

export function TailwindConfig({ children }: { children: ReactNode }) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              ivone: {
                50: '#FEF4F1',
                100: '#FDE9E3',
                200: '#FACBBD',
                300: '#F6AA92',
                400: '#F27E5A',
                500: '#F06B42',
                600: '#ED4917',
                700: '#D03D10',
                800: '#B4350E',
                900: '#80250A',
                950: '#481506',
              },
              gray: {
                50: '#F6F6F7',
                100: '#E1E1E6',
                200: '#C4C4CC',
                300: '#8D8D99',
                400: '#7C7C8A',
                500: '#505059',
                600: '#323238',
                700: '#29292E',
                800: '#202024',
                900: '#121214',
                950: '#09090A',
              },
            },
          },
        },
      }}
    >
      {children}
    </Tailwind>
  )
}
