import React, { useEffect, useState } from 'react'
import './table.css';
import axios from 'axios'

export default function Table() {

  const [orders,setOrders] = useState([]);
  const [loading, setLoading] = useState(false)
  const [cursor,setCursor] = useState(0);

  const fetchOrder = ()=>{
    setLoading(true)
    axios.get(`http://localhost:5000/api/orders?cursor=${cursor}&limit=10`)
    .then((response)=>{
      const newOrder = response.data.data;
      if(newOrder.length > 0 ){
        setOrders((prevOrder)=>[...prevOrder,...newOrder]);
        setCursor((prevCursor)=> prevCursor + 10);
      } 
      setLoading(false)
    })
    .catch((error)=>{
      console.log(error);
      setLoading(false)
      })
  };

  // const handleScroll =()=>{
  //   if(
  //   window.innerHeight + document.documentElement.scrollTop === 
  //   document.documentElement.offsetHeight - 1
  //   )
  //   {
  //     if(!loading){
  //       fetchOrder();
  //     }
  //   }
  // };

  const handleScroll =()=>{
    const scrollTable = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = document.documentElement.scrollTop

    if(scrollTable - currentScroll < 200){
      if(!loading){
        fetchOrder();
        }
    }
  }

  useEffect(()=>{
    fetchOrder();
  },[]);

 useEffect(()=>{
  window.addEventListener('scroll',handleScroll);
  return()=>{
    window.removeEventListener('scroll',handleScroll);
  }
 },[loading])

  return (
	<div className='h-auto bg-orange-200 container flex justify-center overflow-hidden ' >
	  <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Order Amount</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.customer_name}</td>
              <td>{order.order_amount}</td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {
        loading && <p>Loading more data</p>
      }
	</div>
  )
}
