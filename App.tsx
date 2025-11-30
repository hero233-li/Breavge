import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import GenericPage from './components/GenericPage';
import { PageConfig } from './types';

// Page Configurations
const withdrawConfig: PageConfig = {
  title: 'Data Withdrawal',
  description: 'Execute fund withdrawal requests for customer accounts. Supports batch processing via JSON.',
  endpoint: '/transaction/withdraw',
  method: 'POST',
  fields: [
    { name: 'customerId', label: 'Customer ID', type: 'text', placeholder: 'CUST-001', required: true },
    { name: 'accountId', label: 'Account Number', type: 'text', placeholder: 'ACC-8888-9999', required: true },
    { name: 'amount', label: 'Withdrawal Amount', type: 'number', placeholder: '0.00', required: true },
    { name: 'currency', label: 'Currency', type: 'select', options: [{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }, { label: 'CNY', value: 'CNY' }], defaultValue: 'USD', required: true },
    { name: 'reason', label: 'Withdrawal Reason', type: 'text', placeholder: 'Client Request' },
    { name: 'executionDate', label: 'Execution Date', type: 'date', required: true },
  ]
};

const applyConfig: PageConfig = {
  title: 'Process Application',
  description: 'Initiate new loan or service applications.',
  endpoint: '/process/apply',
  method: 'POST',
  fields: [
    { name: 'applicantName', label: 'Applicant Name', type: 'text', required: true },
    { name: 'productType', label: 'Product Type', type: 'select', options: [{ label: 'Personal Loan', value: 'PL' }, { label: 'Mortgage', value: 'MORT' }], required: true },
    { name: 'requestedAmount', label: 'Requested Amount', type: 'number', required: true },
  ]
};

// Placeholder configs for other routes
const standardConfig = (title: string, endpoint: string): PageConfig => ({
  title,
  description: `Debug interface for ${title} operations.`,
  endpoint,
  method: 'POST',
  fields: [
    { name: 'referenceId', label: 'Reference ID', type: 'text', required: true },
    { name: 'actionCode', label: 'Action Code', type: 'text' }
  ]
});

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/withdraw" replace />} />
          <Route path="withdraw" element={<GenericPage config={withdrawConfig} />} />
          <Route path="apply" element={<GenericPage config={applyConfig} />} />
          
          {/* Reusing GenericPage for other routes with simpler configs */}
          <Route path="approve" element={<GenericPage config={standardConfig('Process Approval', '/process/approve')} />} />
          <Route path="sign" element={<GenericPage config={standardConfig('Data Signing', '/data/sign')} />} />
          <Route path="repay" element={<GenericPage config={standardConfig('Data Repayment', '/transaction/repay')} />} />
          <Route path="query" element={<GenericPage config={{...standardConfig('Data Query', '/data/query'), method: 'GET'}} />} />
          <Route path="auto" element={<GenericPage config={standardConfig('Auto Run Batch', '/batch/execute')} />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
