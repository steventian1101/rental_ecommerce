
export default function Layout(props) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className='relative'>{props.children}</main>
    </div>
  )
}
