import { PropsWithChildren } from 'react'

import { ScrollArea } from './ui/scroll-area'



export function Sidebar({ children }: PropsWithChildren) {
  return (
    <div className="w-64 h-screen flex flex-col border-r">
      <ScrollArea className="flex-grow">
        {children}
      </ScrollArea>
    </div>
  )
}
