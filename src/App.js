import React from 'react';
import './App.less';
import { Button } from 'antd';
import Background from '@/img/beauty.jpg';


let sectionStyle = {
  width: "100%",
  height: "100%",
// makesure here is String确保这里是一个字符串，以下是es6写法
  background: `url(${Background}) no-repeat center`,
  backgroundSize: "100%",
};
const prefix="bodyLeft"
class BodyLeft extends React.Component {
  render(h) {
    return (
      <div className={prefix}>
        <div >
          <h2>想</h2>
          <p>做你的爸爸</p>
        </div>
      </div>
    )
  }
}
function App() {
  return (
    <div className="App" style={sectionStyle}>
      <BodyLeft></BodyLeft>
      <header className="App-header">
        <Button type="primary">Button</Button>
      </header>
    </div>
  );
}

export default App;
