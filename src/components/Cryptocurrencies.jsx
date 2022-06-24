import React, { useEffect, useState } from 'react';
import millify from 'millify';
import Loader from './Loader';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {Card, Row, Col, Input, Switch} from  'antd';
import { useGetCryptosQuery } from '../services/cryptoApi';
const Cryptocurrencies = ({simplified}) => {
  // simplified props in home page
  const count = simplified ? 10 : 100;
  // data: renamed to cryptosList
  const {data: cryptosList, isFetching} = useGetCryptosQuery(count);
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [phpcurrency, setPhpCurrency] = useState();
  const [switchValue, setSwitchValue] = useState('USD');

  useEffect(() => {
      axios.get(`https://api.fastforex.io/fetch-one?from=USD&to=PHP&api_key=${process.env.REACT_APP_KEY_PHP}`).then((response) => {
        const phpValue = response.data.result.PHP;
        setPhpCurrency(phpValue);
      }).catch(function (error) {
        if (error.response) {
          console.log('api does not work');
          return <Loader/>
        }
      });

    const filteredData = cryptosList?.data?.coins.filter((coin) => coin.name.toLowerCase().includes(searchTerm.toLowerCase()));

    setCryptos(filteredData);
  }, [cryptosList, searchTerm]);

  const handleSwitch = () => {
      switch(switchValue){
        case 'USD':
        setSwitchValue('PHP');
        break;
        case 'PHP': 
        setSwitchValue('USD');
        break;
        default:
      }
    }

  if(isFetching) return <Loader/>;
  return (
    <>
      {!simplified && (
        <div className='search-crypto'>
          <Input className='input' placeholder='Search Cryptocurrency' onChange={(e) => setSearchTerm(e.target.value)}/>
          <Switch className='switch' checkedChildren="USD" unCheckedChildren="PHP" defaultChecked onClick={() => handleSwitch()} style={{display: 'none'}}/>
        </div>
         
      )}
          <Row gutter={[32,32]} className='crypto-cards-container'>
          {/* Add question mark in crypto in case fetched data is undefined for it to run */}
          {cryptos?.map((currency) => (
            <Col xs={24} sm={12} lg={6} className="crypto-card" key={currency.uuid}>
              <Link to={`/crypto/${currency.uuid}`}>
                <Card hoverable title={`${currency.rank}.${currency.name}`} 
                extra={<img className='crypto-image' src={currency.iconUrl} alt='crypto-img'/>}>
                    <p>Price: {switchValue === 'USD' ? '$' : '₱'}{switchValue === 'PHP' ? (millify(phpcurrency * currency.price)) : millify(currency.price)}</p>
                    <p>Market Cap: {switchValue === 'USD' ? '$' : '₱'}{switchValue === 'PHP' ? millify(phpcurrency * currency.marketCap) : millify(currency.marketCap)}</p>
                    <p style={{color: currency.change >= -0 ? 'green' : 'red'}}>Daily Change: &nbsp;{millify(currency.change)}%</p> 
                </Card>
              </Link>
            </Col> 
          ))}
          </Row>
    </>
  )
}

export default Cryptocurrencies
