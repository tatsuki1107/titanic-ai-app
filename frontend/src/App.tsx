import React, { useState } from 'react';
import axios from "axios";
import './App.css';

const endPoint: string = 'http://localhost:5000/api/titanic';
const rankMap = ["上層クラス(お金持ち)", "中級クラス(一般階級)", "下層クラス(労働階級)"];

interface data {
  Sex: string, Pclass: string, Age: number, Parch: number, SibSp: number
}
interface Result {
  survival_probability: number
};


const App: React.FC = () => {
  const [sex, setSex] = useState<string>();
  const [rank, setRank] = useState<string>();
  const [age, setAge] = useState<number>();
  const [parch, setParch] = useState<number>();
  const [sibSp, setSibSp] = useState<number>();
  const [proba, setProba] = useState<number>();

  const setDisabled = () => {
    if (sex && rank && age && parch && sibSp) {
      return false
    } else {
      return true
    }
  }

  const onSubmit = async (): Promise<void> => {
    const data = {
      Sex: sex, Pclass: rank, Age: age, Parch: parch, SibSp: sibSp
    } as data
    try {
      await axios.post(endPoint, data).then((res: any) => {
        setProba(Math.round(res?.data.survival_probability * 100));
      })
    } catch (e) {
      console.error(e)
    }
  };

  return (
    <div className="App">
      <h1>タイタニック号　生存確率予測AIアプリ</h1>
      <select className='select' onChange={(e) => setSex(e.target.value)}>
        <option disabled selected>性別は？</option>
        <option value="男性">男性</option>
        <option value="女性">女性</option>
      </select>

      <select className='select' onChange={(e) => setRank(e.target.value)}>
        <option disabled selected>階級は？</option>
        {rankMap.map((r, i) => {
          return <option value={r} key={i}>{r}</option>
        })}
      </select>

      <select className='select' onChange={(e) => setAge(Number(e.target.value))}>
        <option disabled selected>年齢は？</option>
        {[...Array(120)].map((_, i) => {
          return <option key={i} value={i + 1}>{i + 1} 歳</option>
        })}
      </select>

      <select className="select" onChange={(e) => setParch(Number(e.target.value))}>
        <option disabled selected>親・子の同伴者数は？</option>
        {[...Array(10)].map((_, i) => {
          return <option key={i} value={i + 1}>{i + 1} 人</option>
        })}
      </select>

      <select className="select" onChange={(e) => setSibSp(Number(e.target.value))}>
        <option disabled selected>兄弟姉妹の同伴者数は？</option>
        {[...Array(10)].map((_, i) => {
          return <option key={i} value={i + 1}>{i + 1} 人</option>
        })}
      </select>

      <button className='button' onClick={onSubmit} disabled={setDisabled()}>結果を出力</button>

      {proba && <h2 className='result'>生存確率: 約{proba}%</h2>}
    </div>
  );
}

export default App;
