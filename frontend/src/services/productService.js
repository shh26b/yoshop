import * as httpC from "../utils/httpC.js";
import { extractFromLocalStorage } from "../utils/localStorageUtil.js";
import { logIfNotProduction, logReqNotProd } from "../utils/loggerUtil.js";
import { extractErrorMessage as eem } from "./../logic/commonLogic.js";

export const getProductsRequest = async (keyword, pageNumber) => {
    try {
        const { data } = await httpC.get(
            `/products?keyword=${keyword}&pageNumber=${pageNumber}&pageSize=10`,
            null
        );
        return data;
    } catch (e) {
        throw new Error(logReqNotProd(e));
    }
};

export const getProductByIdRequest = async productId => {
    try {
        const { data: product, status } = await httpC.get(
            `/products/${productId}`,
            null
        );
        return { product, status };
    } catch (e) {
        const message = eem(
            e,
            `Get product with id ${productId} request unsuccessful`
        );
        logIfNotProduction(message);
        throw new Error(message);
    }
};

export const deleteProductByIdRequest = async (productId, token) => {
    try {
        const { data } = await httpC.deleteR(`/products/${productId}`, token);
        return data;
    } catch (e) {
        const message = eem(
            e,
            `Get product with id ${productId} request unsuccessful`
        );
        logIfNotProduction(message);
        throw new Error(message);
    }
};

export const updateProductRequest = async (productId, productData, token) => {
    try {
        const { data } = await httpC.put(
            `/products/${productId}`,
            productData,
            token
        );
        return data;
    } catch (e) {
        const message = eem(
            e,
            `Update product with id ${productId} request unsuccessful`
        );
        logIfNotProduction(message);
        throw new Error(message);
    }
};

export const createSampleProductRequest = async token => {
    try {
        const { data } = await httpC.post("/products", {}, token);
        return data;
    } catch (e) {
        const message = eem(e, "Create product request unsuccessful");
        logIfNotProduction(message);
        throw new Error(message);
    }
};

export const imageUploadRequest = async formData => {
    try {
        const token = extractFromLocalStorage("userInfo", "f**k").token;
        return await httpC.postFile("/uploads", formData, token);
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const productCreateReviewRequest = async (productId, review, token) => {
    try {
        const { data } = await httpC.post(
            `/products/${productId}/reviews`,
            review,
            token
        );
        return data;
    } catch (e) {
        throw new Error(logReqNotProd(e));
    }
};
