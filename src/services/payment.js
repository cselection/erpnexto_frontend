import { axiosPaymentInstance } from './axios';
import { PAYMENT_AUTH_API, REGISTER_ORDER_API, GET_PAYMENT_KEY_API } from "./apis";
import paymentConfig from '../config/paymentConfig.json';


    export const authenticate = async () => {
        try{
            let data = {
                api_key : paymentConfig.API_KEY
            }
            console.log(data.api_key)
            let response = await axiosPaymentInstance.post(PAYMENT_AUTH_API, data);
            console.log("hamaaaaaaaaaaada" + response.status);
            if(response.status === 201){
                console.log("hamaaaaaaaaaaaaaaada")
                console.log(response.data);
                console.log(response.data.token);
                localStorage.setItem("payment_authentication_token", response.data.token);
                registerOrder();
            }else{
                console.log(response.data.error)
            }
        }catch(error){
            console.log(error)
        }
    }

    export const registerOrder = async (plan) => {
        try{
            let request_data = {
                auth_token: localStorage.getItem("payment_authentication_token"),
                delivery_needed : "false",
                amount_cents : paymentConfig.STANDARD_PLAN_PRICE,
                currency : "EGP",
                merchant_order_id : 23 ,
                items : [
                        {
                            name: paymentConfig.STANDARD_PLAN_NAME,
                            amount_cents: paymentConfig.STANDARD_PLAN_PRICE,
                            description: paymentConfig.STANDARD_PLAN_DESCRIPTION,
                            quantity: "1"
                        }
                    ]
                }
            console.log("order token is " + request_data.auth_token)
            let response = await axiosPaymentInstance.post(REGISTER_ORDER_API, request_data);
            console.log(response.status);
            if(response.status === 200 || response.status === 201){
                console.log(response.data);
                localStorage.setItem("payment_order_id", response.data.id);
                getPaymentKey();
            }else{
                console.log(response.data.error)
            }
        }catch(error){
            console.log(error)
        }
    }

    export const getPaymentKey = async () => {
        try{
            let request_data = {
                auth_token: localStorage.getItem("payment_authentication_token"),
                amount_cents: paymentConfig.STANDARD_PLAN_PRICE, 
                expiration: 3600, 
                order_id: localStorage.getItem("payment_order_id"),
                billing_data: {
                    apartment: "NA", 
                    email: "claudette09@exa.com", 
                    floor: "NA", 
                    first_name: "Clifford", 
                    street: "Ethan Land", 
                    building: "NA", 
                    phone_number: "+86(8)9135210487", 
                    shipping_method: "NA", 
                    postal_code: "NA", 
                    city: "NA", 
                    country: "NA", 
                    last_name: "Nicolas", 
                    state: "NA"
                }, 
                currency: "EGP", 
                integration_id: 1,
                lock_order_when_paid: "false"
            }
            console.log("payment token is " + request_data.auth_token)
            console.log("payment token is " + request_data.order_id)
            let response = await axiosPaymentInstance.post(GET_PAYMENT_KEY_API, request_data);
            console.log(response.status);
            if(response.status === 200 || response.status === 201 ){
                console.log(response.data);
                localStorage.setItem("payment_token", response.data.token);
            }else{
                console.log(response.data.error)
            }
        }catch(error){
            console.log(error)
        }
    }

