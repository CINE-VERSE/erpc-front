import axios from 'axios';

const API_URL = 'http://localhost:7775/delete';

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

  getSalesOppDeleteRequestById(id) {
    return this.api.get(`/sales_opp/${id}`);
  }

  updateSalesOppDeleteRequestStatus(id, data) {
    return this.api.patch(`/sales_opp/status/${id}`, data);
  }

  // Contract Delete Requests
  getContractDeleteRequests() {
    return this.api.get('/contract');
  }

  getContractDeleteRequestById(id) {
    return this.api.get(`/contract/${id}`);
  }

  updateContractDeleteRequestStatus(id, data) {
    return this.api.patch(`/contract/status/${id}`, data);
  }

  // Quotation Delete Requests
  getQuotationDeleteRequests() {
    return this.api.get('/quotation');
  }

  getQuotationDeleteRequestById(id) {
    return this.api.get(`/quotation/${id}`);
  }

  processQuotationDeleteRequest(id, data) {
    return this.api.patch(`/quotation/process/${id}`, data);
  }

  // Account Delete Requests
  getAccountDeleteRequests() {
    return this.api.get('/account');
  }

  getAccountDeleteRequestById(id) {
    return this.api.get(`/account/${id}`);
  }

  processAccountDeleteRequest(id, data) {
    return this.api.patch(`/account/process/${id}`, data);
  }

  // Order Delete Requests
  getOrderDeleteRequests() {
    return this.api.get('/order');
  }

  getOrderDeleteRequestById(id) {
    return this.api.get(`/order/${id}`);
  }

  processOrderDeleteRequest(id, data) {
    return this.api.patch(`/order/process/${id}`, data);
  }
}

export default new DeleteService();