/* eslint-disable @typescript-eslint/no-explicit-any */
const Row = ({ label, value, right }: { label: string; value: any; right?: any }) => (
  <div className="grid grid-cols-12 items-center gap-4 py-5 border-b border-gray-200 last:border-b-0">
    <div className="col-span-12 md:col-span-4 text-sm text-gray-500">
      {label}
    </div>

    {/* Value */}
    <div className="col-span-12 md:col-span-6 text-sm text-gray-900 font-medium">
      {value}
    </div>

    {/* Right action */}
    <div className="col-span-12 flex justify-end md:col-span-2 md:text-right text-sm text-indigo-600 font-medium cursor-pointer">
      {right}
    </div>
  </div>
);

const Merchant = () => {
  return (
    <div className="max-w-3xl border border-gray-200 rounded-xl bg-white p-6">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-base font-semibold text-gray-900">
            Merchant Details
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Your business and owner info that you've provided applying for Payments
          </div>
        </div>

        <button className="text-sm text-indigo-600 font-medium">
          Edit
        </button>
      </div>

      <Row label="Merchant ID" value="5247715882829186" right={undefined} />

      <Row
        label="Merchant Legal Name"
        value="Acme Innovations Inc."
        right="View"
      />

      <Row
        label="DBA / Trading Name"
        value="Acme Tech Solutions"
        right="View"
      />

      <Row
        label="Merchant Status"
        value={
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-green-600 flex items-center justify-center text-white text-xs">
              ✓
            </div>
            Active
          </div>
        }
        right="View Details"
      />

      <Row
        label="Linked Subscription Plan"
        value="Pro Tier Monthly"
        right={
          <div className="w-10 h-6 bg-indigo-600 rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        }
      />

      <Row
              label="Merchant Service Center Access"
              value={<span className="text-indigo-600 font-medium">Yes</span>} right={undefined}      />

      {/* Notes Section */}
      <div className="pt-6">
        <div className="text-sm font-medium text-gray-900 mb-2">
          Internal Notes (Support/Admin Only)
        </div>

        <textarea
          placeholder="Add notes about merchant history, on interactions, or configuration specifics..."
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={3}
        />
      </div>

    </div>
  );
};

export default Merchant;
