import Item from "./Item"
import './styles/Header.css'

export default function Header() {
  const names = ["Keyboard", "Dictionary", "Stories"] // Mock

  return (
    <header>
      <ul>
        {
          names.map((entry, index) => {
            return (
              <Item key={index} name={entry} />
            )
          })
        }
      </ul>
    </header>
  )
}
