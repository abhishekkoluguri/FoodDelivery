import { createContext, useEffect, useState } from "react";
import axios from "axios"
export const StoreContext=createContext(null)

const StoreContextProvider=(props)=>{

    const [cartItems,setCartItems]=useState({})
    const url="http://localhost:4000";
    const [token,setToken]=useState("");
     const [food_list,setFoodList]=useState([])
    

    const addToCart=async(itemId)=>{
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        if(token){
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }
    const removeFromCart=async(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }

    const getTotalCartAmount=()=>{
        let totalAmount=0;
        for(const item in cartItems){
            if(cartItems[item]>0){
               let itemInfo=food_list.find((product)=>product._id===item)
               totalAmount+=itemInfo.price*cartItems[item];
            }
        }
        return  totalAmount;
    }

    const fetchFoodlist=async()=>{
        const response=await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }

   const loadCartData = async (token) => {
    try {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        console.log("Cart data response:", response.data); // Log the full response

        // Check if cartData exists in the response
        if (response.data.success && response.data.cartData) {
            setCartItems(response.data.cartData);  // Update state with cart data
        } else {
            console.error("Cart data not found in response:", response.data);
        }
    } catch (error) {
        console.error("Error loading cart data:", error);
    }
};

    

    useEffect(()=>{       
        async function loadData() {
            await fetchFoodlist();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"))
            }
        }
        loadData();
    },[])
    const contextValue={
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }
    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}
export default StoreContextProvider;