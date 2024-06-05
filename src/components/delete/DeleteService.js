import axios from 'axios';

const API_URL = 'http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/delete';

class DeleteService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
    });
  }


  getSalesOppDeleteRequests() {
    return this.api.get('/sales_opp');
  }

  findSalesOppDeleteRequestById(salesOppDeleteRequestId) {
    return this.api.get(`/sales_opp/${salesOppDeleteRequestId}`);
  }

  updateSalesOppDeleteRequestProcess(data) {
    return this.api.patch('/sales_opp/process', data);
  }

  // Contract Delete Requests
  getContractDeleteRequests() {
    return this.api.get('/contract');
  }

  findContractDeleteRequestById(contractDeleteRequestsId) {
    return this.api.get(`/contract/${contractDeleteRequestsId}`);
  }

  updateContractDeleteRequestStatus( data) {
    return this.api.patch('/contract/process', data);
  }

  // Quotation Delete Requests
  getQuotationDeleteRequests() {
    return this.api.get('/quotation');
  }

  findQuotationDeleteRequestById(quotationDeleteRequestsId) {
    return this.api.get(`/quotation/${quotationDeleteRequestsId}`);
  }

  processQuotationDeleteRequest( data) {
    return this.api.patch('/quotation/permission', data);
  }

  // Account Delete Requests
  getAccountDeleteRequests() {
    return this.api.get('/account');
  }

  findAccountDeleteRequestById(accountDeleteRequestsId) {
    return this.api.get(`/account/${accountDeleteRequestsId}`);
  }

  processAccountDeleteRequest(data) {
    return this.api.patch('/account/process', data);
  }


  getOrderDeleteRequests() {
    return this.api.get('/order');
  }

  findOrderDeleteRequestById(orderDeleteRequestsId) {
    return this.api.get(`/order/${orderDeleteRequestsId}`);
  }

  processOrderDeleteRequest(data) {
    return this.api.patch('/order/process', data);
  }
}

export default new DeleteService();