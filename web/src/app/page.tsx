import { EmptyMemories } from '@/components/EmptyMemories'

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[url(../assets/bg-stars.svg)] bg-cover p-16">
      <EmptyMemories></EmptyMemories>
    </div>
  )
}
