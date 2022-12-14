import {
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_LIST_FAIL,
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_FAIL,
    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_LIST_RESET,
    PRODUCT_DETAILS_RESET,
    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
    PRODUCT_TOP_LIST_REQUEST,
    PRODUCT_TOP_LIST_SUCCESS,
    PRODUCT_TOP_LIST_FAIL,
} from "./../constants/productConstants.js";
import {
    getProductsRequest,
    getProductByIdRequest,
    deleteProductByIdRequest,
    updateProductRequest,
    createSampleProductRequest,
    productCreateReviewRequest,
    getTopProductsRequest,
} from "../../services/productService.js";
import { getTokenFromState } from "../../logic/commonLogic.js";

export const productListAction =
    (keyword = "", pageNumber = 1) =>
    async dispatch => {
        try {
            dispatch({ type: PRODUCT_LIST_REQUEST });

            const data = await getProductsRequest(keyword, pageNumber);

            dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
        } catch (e) {
            dispatch({ type: PRODUCT_LIST_FAIL, payload: e.message });
        }
    };

export const productDetailsAction = productId => async dispatch => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const { product } = await getProductByIdRequest(productId);

        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: product });
    } catch (e) {
        dispatch({ type: PRODUCT_DETAILS_FAIL, payload: e.message });
    }
};

export const productDeleteAction = productId => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_DELETE_REQUEST });

        const token = getTokenFromState(getState());
        await deleteProductByIdRequest(productId, token);

        dispatch({ type: PRODUCT_DELETE_SUCCESS });
    } catch (e) {
        dispatch({ type: PRODUCT_DELETE_FAIL, payload: e.message });
    }
};

export const productCreateAction = () => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_CREATE_REQUEST });

        const token = getTokenFromState(getState());
        const data = await createSampleProductRequest(token);

        dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
    } catch (e) {
        dispatch({ type: PRODUCT_CREATE_FAIL, payload: e.message });
    }
};

export const productUpdateAction =
    (productId, productData) => async (dispatch, getState) => {
        try {
            dispatch({ type: PRODUCT_UPDATE_REQUEST });

            const token = getTokenFromState(getState());
            const data = await updateProductRequest(
                productId,
                productData,
                token
            );

            dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
            dispatch({ type: PRODUCT_DETAILS_RESET });
            dispatch({ type: PRODUCT_LIST_RESET });
        } catch (e) {
            dispatch({ type: PRODUCT_UPDATE_FAIL, payload: e.message });
        }
    };

export const productCreateReviewAction =
    (productId, review) => async (dispatch, getState) => {
        try {
            dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST });

            const token = getTokenFromState(getState());
            await productCreateReviewRequest(productId, review, token);

            dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS });
        } catch (e) {
            dispatch({ type: PRODUCT_CREATE_REVIEW_FAIL, payload: e.message });
        }
    };

export const productTopListAction = () => async dispatch => {
    try {
        dispatch({ type: PRODUCT_TOP_LIST_REQUEST });

        const data = await getTopProductsRequest();

        dispatch({ type: PRODUCT_TOP_LIST_SUCCESS, payload: data });
    } catch (e) {
        dispatch({ type: PRODUCT_TOP_LIST_FAIL, payload: e.message });
    }
};
