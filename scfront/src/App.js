import './App.css';
import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import MainContainer from './components/MainContainer';
import MyPage from './components/MyPage';
import CartPage from './components/CartPage';

function App() {
  return (
    <Routes>
      {/* 공통 레이아웃 적용 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<MainContainer />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="cartpage" element={<CartPage />} />
      </Route>
    </Routes>
  );
}

export default App;
