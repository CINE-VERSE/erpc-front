import axios from 'axios';

const API_URL = 'http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/delete';

class DeleteService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
    });
  }

  // Sales Opportunity Delete Requests
  getSalesOppDeleteRequests() {
    return this.api.get('/sales_opp');
  }

  getSalesOppDeleteRequestById(salesOppDeleteRequestId) {
    return this.api.get(`/sales_opp/${salesOppDeleteRequestId}`);
  }

  updateSalesOppDeleteRequestStatus(salesOppDeleteRequestId, data) {
    return this.api.patch(`/sales_opp/permission/${salesOppDeleteRequestId}`, data);
  }

  // Contract Delete Requests
  getContractDeleteRequests() {
    return this.api.get('/contract');
  }

  getContractDeleteRequestById(contractDeleteRequestsId) {
    return this.api.get(`/contract/${contractDeleteRequestsId}`);
  }

  updateContractDeleteRequestStatus(contractDeleteRequestsId, data) {
    return this.api.patch(`/contract/status/${contractDeleteRequestsId}`, data);
  }

  // Quotation Delete Requests
  getQuotationDeleteRequests() {
    return this.api.get('/quotation');
  }

  getQuotationDeleteRequestById(quotationDeleteRequestsId) {
    return this.api.get(`/quotation/${quotationDeleteRequestsId}`);
  }

  processQuotationDeleteRequest(quotationDeleteRequestsId, data) {
    return this.api.patch(`/quotation/process/${quotationDeleteRequestsId}`, data);
  }

  // Account Delete Requests
  getAccountDeleteRequests() {
    return this.api.get('/account');
  }

  getAccountDeleteRequestById(accountDeleteRequestsId) {
    return this.api.get(`/account/${accountDeleteRequestsId}`);
  }

  processAccountDeleteRequest(accountDeleteRequestsId, data) {
    return this.api.patch(`/account/process/${accountDeleteRequestsId}`, data);
  }

  // Order Delete Requests
  getOrderDeleteRequests() {
    return this.api.get('/order');
  }

  getOrderDeleteRequestById(orderDeleteRequestsId) {
    return this.api.get(`/order/${orderDeleteRequestsId}`);
  }

  processOrderDeleteRequest(orderDeleteRequestsId, data) {
    return this.api.patch(`/order/process/${orderDeleteRequestsId}`, data);
  }
}

export default new DeleteService();