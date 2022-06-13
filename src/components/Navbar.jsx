import React, {useState, useEffect} from 'react'
import { Button, Menu, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, MoneyCollectOutlined, BulbOutlined, FundOutlined, MenuOutlined } from '@ant-design/icons';
import icon from '../assets/images/cryptocurrency.png';

function Navbar() {
    const [activeMenu, setActiveMenu] = useState(true);
    const [screenSize, setScreenSize] = useState(null);

    useEffect(() => {
        // window.innerWidth to get the width of the screen
        const handleResize = () => setScreenSize(window.innerWidth);
        // everytime the window resizes handleResize
        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    },[]);

    useEffect(() => {
        if(screenSize < 768){
            setActiveMenu(false);
        } else {
            setActiveMenu(true);
        }
    },[screenSize])
    
    const handleMenu = () => {
        if(screenSize < 768){
            setActiveMenu(false);
        } else {
            return false;
        }
    }

  return (
    <div className="nav-container">
        <div className="logo-container">
            <Avatar src={icon} size="large"/>
            <Typography.Title level={2} className="logo">
                <Link to="/">Cryptoverse</Link>
            </Typography.Title>
            <Button className="menu-control-container" onClick={() => setActiveMenu(!activeMenu)}>
                <MenuOutlined/>
            </Button>
        </div>
    {activeMenu && (
    <Menu theme="dark">
        <Menu.Item icon={<HomeOutlined/>} onClick={handleMenu}>
            <Link to="/"> Home</Link>
        </Menu.Item>
        <Menu.Item icon={<FundOutlined/>} onClick={handleMenu}>
            <Link to="/cryptocurrencies"> Cryptocurrencies</Link>
        </Menu.Item>
        <Menu.Item icon={<MoneyCollectOutlined/>} onClick={handleMenu}>
            <Link to="/exchanges"> Exchanges</Link>
        </Menu.Item>
        <Menu.Item icon={<BulbOutlined/>} onClick={handleMenu}>
            <Link to="/news"> News</Link>
        </Menu.Item>
    </Menu>
   )}
</div>  
  )
}

export default Navbar