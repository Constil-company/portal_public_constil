# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createProduct**](#createproduct) | **POST** /api/v1/products | Create a new product|
|[**getAllProducts**](#getallproducts) | **GET** /api/v1/products | Retrieve a list of products|
|[**updateProductPartially**](#updateproductpartially) | **PUT** /api/v1/products/{id} | Partially update a product|

# **createProduct**
> ProductResponse createProduct(createProductRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CreateProductRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let createProductRequest: CreateProductRequest; //

const { status, data } = await apiInstance.createProduct(
    createProductRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createProductRequest** | **CreateProductRequest**|  | |


### Return type

**ProductResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Product successfully created |  -  |
|**400** | Bad request |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllProducts**
> GetAllProductsPaginatedResponse getAllProducts()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let from: number; //The starting index of the products. (optional) (default to undefined)
let size: number; //The number of products to return. (optional) (default to undefined)
let filter: string; //Filter criteria for products. (optional) (default to undefined)
let orderBy: 'createdAt'; //Field to order products by. (optional) (default to undefined)
let direction: 'ASC' | 'DESC'; //Sorting direction. (optional) (default to undefined)

const { status, data } = await apiInstance.getAllProducts(
    from,
    size,
    filter,
    orderBy,
    direction
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **from** | [**number**] | The starting index of the products. | (optional) defaults to undefined|
| **size** | [**number**] | The number of products to return. | (optional) defaults to undefined|
| **filter** | [**string**] | Filter criteria for products. | (optional) defaults to undefined|
| **orderBy** | [**&#39;createdAt&#39;**]**Array<&#39;createdAt&#39;>** | Field to order products by. | (optional) defaults to undefined|
| **direction** | [**&#39;ASC&#39; | &#39;DESC&#39;**]**Array<&#39;ASC&#39; &#124; &#39;DESC&#39;>** | Sorting direction. | (optional) defaults to undefined|


### Return type

**GetAllProductsPaginatedResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A paginated list of products |  -  |
|**400** | Bad request |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateProductPartially**
> ProductResponse updateProductPartially(updateProductRequest)


### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UpdateProductRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; //The ID of the product to update (default to undefined)
let updateProductRequest: UpdateProductRequest; //

const { status, data } = await apiInstance.updateProductPartially(
    id,
    updateProductRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProductRequest** | **UpdateProductRequest**|  | |
| **id** | [**string**] | The ID of the product to update | defaults to undefined|


### Return type

**ProductResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Product successfully updated |  -  |
|**400** | Bad request |  -  |
|**404** | Product not found |  -  |
|**500** | Internal server error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

