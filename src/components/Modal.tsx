type Props = {
  children: any,
  isActive: boolean,
  setIsActive: any,
  label?: string,
}

export default function Modal({ children, isActive, setIsActive, label }: Props) {
  if (!isActive) {
    return <></>
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur" onClick={() => { setIsActive(false) }}>
      <div className="w-1/3 bg-white border-2 border-black p-6 relative" onClick={(event: any) => { event.stopPropagation() }}>
        <h2 className="font-bold text-3xl uppercase bg-black text-white inline-block mb-3 px-2 py-1 absolute bottom-full left-0 transform -translate-x-[2px]">{label}</h2>
        <svg onClick={() => { setIsActive(false) }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 absolute top-0 right-0 transform -translate-y-[3.5rem] cursor-pointer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}