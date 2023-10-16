import './styles/Keyboard.css'

export default function Keyboard() {
  const letters =
    [
      {0:'Й', 1: 'й', 2: 'q'},{0:'Ц', 1: 'ц', 2: 'w'},{0:'У', 1: 'у', 2: 'e'},{0:'К', 1: 'к', 2: 'r'},
      {0:'Е', 1: 'е', 2: 't'},{0:'Н', 1: 'н', 2: 'y'},{0:'Г', 1: 'г', 2: 'u'},{0:'Ш', 1: 'ш', 2: 'i'},
      {0:'Щ', 1: 'щ', 2: 'o'},{0:'З', 1: 'з', 2: 'p'},{0:'Х', 1: 'х', 2: '¨'},{0:'Ъ', 1: 'ъ', 2: '*'},
      {0:'Ф', 1: 'ф', 2: 'a'},{0:'Ы', 1: 'ы', 2: 's'},{0:'В', 1: 'в', 2: 'd'},{0:'А', 1: 'а', 2: 'f'},
      {0:'П', 1: 'п', 2: 'g'},{0:'Р', 1: 'р', 2: 'h'},{0:'О', 1: 'о', 2: 'j'},{0:'Л', 1: 'л', 2: 'k'},
      {0:'Д', 1: 'д', 2: 'l'},{0:'Ж', 1: 'ж', 2: 'ñ'},{0:'Э', 1: 'э', 2: '['},{0:'Я', 1: 'я', 2: 'z'},
      {0:'Ч', 1: 'ч', 2: 'x'},{0:'С', 1: 'с', 2: 'c'},{0:'М', 1: 'м', 2: 'v'},{0:'И', 1: 'и', 2: 'b'},
      {0:'Т', 1: 'т', 2: 'n'},{0:'Ь', 1: 'ь', 2: 'm'},{0:'Б', 1: 'б', 2: ';'},{0:'Ю', 1: 'ю', 2: ':'},
    ];

  return (
    <div className='keyboard'>
      <div className='row'>
        {
          letters.slice(0,12).map((letter, index) => {
            return (
              <div className="letter"><span>{letter[0]}</span></div>
            )
          })
        }
      </div>
      <div className='row'>
        {
          letters.slice(12,23).map((letter, index) => {
            return (
              <div className="letter"><span>{letter[0]}</span></div>
            )
          })
        }
      </div>
      <div className='row'>
        {
          letters.slice(23).map((letter, index) => {
            return (
              <div className="letter"><span>{letter[0]}</span></div>
            )
          })
        }
      </div>
    </div>
  )
}
