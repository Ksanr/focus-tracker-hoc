import { useState } from 'react';
import Input from './components/Input';
import { withFocusTracker } from './hoc/withFocusTracker';

// Оборачиваем Input с помощью HOC
const InputWithFocusTracker = withFocusTracker(Input);

function App() {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const handleFocusChange = (isFocused: boolean) => {
    setFocused(isFocused);
    console.log('Focus changed:', isFocused);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Демонстрация HOC withFocusTracker</h1>
      <div>
        <InputWithFocusTracker
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocusChange={handleFocusChange}
          onFocus={(e) => console.log('Input focused', e)}
          onBlur={(e) => console.log('Input blurred', e)}
          placeholder="Введите текст..."
        />
        <p>Состояние фокуса: {focused ? 'В фокусе ✅' : 'Не в фокусе ❌'}</p>
      </div>
    </div>
  );
}

export default App;