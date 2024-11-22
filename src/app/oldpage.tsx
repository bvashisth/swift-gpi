import SwiftGpiDashboard from './swift-gpi-dashboard'
import SwiftGpiCreation from './swift-gpi-creation'
import SwiftMessageDisplay from './swift-message-display'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SwiftGpiDashboard />
      <SwiftGpiCreation />
      <SwiftMessageDisplay 
        senderBank="Your Bank"
        senderBIC="YOURBICCODE"
        senderReference="YOUR-REF-123"
        trn="TRN987654321"
        amount="100000.00"
        currency="USD"
        receiverBIC="RECEIVERBIC"
        beneficiaryName="Jane Smith"
        beneficiaryAccount="987654321"
        remittanceInfo="Payment for contract XYZ"
      />
    </main>
  )
}