/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.

declare module '@radix-ui/react-slot' {
  interface SlotProps extends React.HTMLAttributes<HTMLElement> {
    asChild?: boolean
  }
  const Slot: React.ForwardRefExoticComponent<
    SlotProps & React.RefAttributes<HTMLElement>
  >
  export { Slot }
}