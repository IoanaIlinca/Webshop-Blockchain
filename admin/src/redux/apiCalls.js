import {
    deleteUserFailure, deleteUserStart,
    deleteUserSuccess,
    getUserFailure,
    getUserStart,
    getUserSuccess,
    loginFailure,
    loginStart,
    loginSuccess, logout
} from "./userRedux";
import {publicRequest, userRequest} from "../requestMethods";
import {
    addProductFailure,
    addProductStart,
    addProductSuccess,
    deleteProductFailure,
    deleteProductStart,
    deleteProductSuccess, getProductFailure,
    getProductStart, getProductSuccess,
    updateProductFailure,
    updateProductStart,
    updateProductSuccess
} from "./productRedux";
import {
    updateDeployed,
    setDeployed,
    setInitialised,
    updateDeployedProduct,
    updateDeployedOrders, updateentries, updateEntries, emptyEntries
} from "./blockchainRedux";
import {getOrderFailure, getOrderStart, getOrderSuccess, updateOrderStatus} from "./orderRedux";
import {
    billAdded,
    deployBill,
    deployEntry,
    deployProduct,
    entryDeployed,
    getProductForEntry,
    productAdded
} from "../web3/web3Init";
import {useState} from "react";

export const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
        const res = await publicRequest.post("authentication/login", user);
        dispatch(loginSuccess(res.data));
    } catch (err) {
        dispatch(loginFailure());
    }
};

export const logoutCall = async (dispatch, user) => {
    dispatch(logout());
};


export const getProducts = async (dispatch) => {
    dispatch(getProductStart());
    try {
        const res = await publicRequest.get("/products");
       // dispatch(setDeployed([]));
        for (let product of res.data) {
             productAdded(product._id, product.title, product.price * 100, 24 * 100).then(depl => {
                dispatch(updateDeployed({id: product._id, value: depl}));
            });
        }
        dispatch(getProductSuccess(res.data));

    } catch (err) {
        dispatch(getProductFailure());
    }
};

export const deleteProduct = async (id, dispatch) => {
    dispatch(deleteProductStart());
    try {
        const res = await userRequest.delete(`/products/${id}`);
        dispatch(deleteProductSuccess(id));
    } catch (err) {
        dispatch(deleteProductFailure());
    }
};

export const deployProductCall = async (id, name, price, VAT, dispatch) => {
    const res = await deployProduct(id, name, price * 100, VAT * 100);
    if (res) {
        dispatch(updateDeployedProduct({id: id}))
    }

};


export const deployBillCall = async (id, total) => {
    let date = new Date().getTime();
   try {
        await deployBill(id, date, total * 100);
        return true;
   }
   catch (error) {
       console.log(error.message);
       return false;
   }

};


export const deployEntryCall = async (dispatch, orderId, productId, quantity) => {
    const res = await deployEntry(orderId, productId, quantity);
    dispatch(updateEntries({orderId: orderId, productId:  productId, value: res}));

};

export const updateProduct = async (id, product, dispatch) => {
    dispatch(updateProductStart());
    try {
        const res = await userRequest.put(`/products/${id}`, product);
       // console.log(res.data);
        dispatch(updateProductSuccess(res.data));
    } catch (err) {
        dispatch(updateProductFailure());
    }
};

export const addProduct = async (product, dispatch) => {
    dispatch(addProductStart());
    try {
        const res = await userRequest.post(`/products`, product);
        dispatch(addProductSuccess(res.data));
    } catch (err) {
        dispatch(addProductFailure());
    }
};


export const getUsers = async (dispatch) => {
    dispatch(getUserStart());
    try {
        const res = await userRequest.get("/users");
        dispatch(getUserSuccess(res.data));
    } catch (err) {
        dispatch(getUserFailure());
    }
};

export const getUser = async (userId) => {
    try {
        return await userRequest.get("/users/" + userId);
    } catch (err) {
        alert(err);
    }
}


export const deleteUser = async (id, dispatch) => {
    dispatch(deleteUserStart());
    try {
        const res = await userRequest.delete(`/users/${id}`);
        dispatch(deleteUserSuccess(id));
    } catch (err) {
        dispatch(deleteUserFailure());
    }
};


export const getOrders = async (dispatch) => {
    dispatch(getOrderStart());

    try {
        const res = await userRequest.get("/orders");
        for (let order of res.data) {
            billAdded(order._id).then(depl => {
                dispatch(updateDeployedOrders({id: order._id, value: depl}));
                for (let product of order.products) {
                    if (depl === false) {
                        dispatch(updateEntries({orderId: order._id, productId:  product._id, value: false}));
                    }
                    else {
                       try{
                           entryDeployed(order._id, product._id, product.quantity).then(depl => {
                               dispatch(updateEntries({orderId: order._id, productId:  product._id, value: depl}));
                           })
                       }
                       catch (error) {
                           dispatch(updateEntries({orderId: order._id, productId:  product._id, value: false}));
                       }
                    }
                }
            });

        }
        dispatch(getOrderSuccess(res.data));
    } catch (err) {
        dispatch(getOrderFailure());
    }
};

export const setInitTrue = async (dispach) => {
    dispach(setInitialised())
}

export const updateOrder = async (dispach, order) => {
    const res = await userRequest.put(`/orders/${order._id}`, order);
    dispach(updateOrderStatus({_id: order._id, status: order.status}));
}


export const getProdInOrder = async (orderId, productId) => {

    return  await getProductForEntry(orderId, productId);
}