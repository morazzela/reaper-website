import { useEffect } from "react"

type Props = {
  children: any,
  isActive: boolean,
  setIsActive: any,
  label?: string,
}

export default function Modal({ children, isActive, setIsActive, label }: Props) {
  useEffect(() => {
    if (isActive) {
      document.body.classList.add("overflow-y-hidden")
    } else {
      document.body.classList.remove("overflow-y-hidden")
    }
  }, [isActive])

  if (!isActive) {
    return <></>
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur p-4 md:p-0 overflow-y-scroll" onClick={() => { setIsActive(false) }}>
      <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 h-auto max-h-full" onClick={(event: any) => { event.stopPropagation() }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl md:text-3xl uppercase bg-black text-white inline-block px-2 py-1">{label}</h2>
          <svg onClick={() => { setIsActive(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="bg-white border-2 border-black p-6">
          {children}
        </div>
      </div>
    </div>
  )
}