"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface SwiftMessageProps {
  senderBank: string
  senderBIC: string
  senderReference: string
  amount: string
  currency: string
  receiverBIC: string
  beneficiaryName: string
  beneficiaryAccount: string
  remittanceInfo: string
  trn: string
}

export default function SwiftMessageDisplay({
  senderBank = "Deutsche Bank",
  senderBIC = "DEUTDEFF",
  senderReference = "INVOICE123",
  amount = "50000.00",
  currency = "EUR",
  receiverBIC = "BOFAUS3NXXX",
  beneficiaryName = "John Doe",
  beneficiaryAccount = "123456789",
  remittanceInfo = "Payment for services rendered",
  trn = "TRN123456789",
}: SwiftMessageProps) {
  const [showRaw, setShowRaw] = useState(false)

  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const messageSequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
  const uetr = generateUETR()

  const formattedMessage = `
SWIFT Message Details:
----------------------
Message Type: MT 103 - Single Customer Credit Transfer
Sender: ${senderBank} (${senderBIC})
Receiver: ${receiverBIC}
Message Sequence: ${messageSequence}
UETR: ${uetr}
Date: ${currentDate}

Transaction Information:
------------------------
Sender's Reference: ${senderReference}
Transaction Reference Number (TRN): ${trn}
Amount: ${currency} ${amount}
Value Date: ${currentDate}
Process Type: Semi-Automated GPI
Funds Destination: Common Account

Ordering Customer:
------------------
${senderBank}
${senderBIC}

Beneficiary Customer:
---------------------
Account: ${beneficiaryAccount}
Name: ${beneficiaryName}

Remittance Information:
-----------------------
${remittanceInfo}

Charges: SHA (Shared)

SWIFT Message Content:
----------------------
{1:F01${senderBIC}AXXX0000000000}
{2:I103${receiverBIC}N}
{3:{108:${messageSequence}}
{121:${uetr}}}
{4:
:20:${senderReference}
:23B:CRED
:32A:${currentDate}${currency}${amount}
:50K:/${beneficiaryAccount}
${beneficiaryName}
:59:/${beneficiaryAccount}
${beneficiaryName}
:70:${remittanceInfo}
:71A:SHA
-}
{5:{MAC:00000000}{CHK:000000000000}}

Additional Information:
-----------------------
This SWIFT message represents a semi-automated GPI (Global Payments Innovation) transaction.
Funds will be deposited into a common account for further processing.
The message is authenticated and encrypted for secure transmission.
Please ensure all details are correct before processing the payment.
For any queries, please contact the sending institution.

Disclaimer: This message is for demonstration purposes only.
  `.trim()

  const rawMessage = formattedMessage.replace(/\n/g, '\r\n')

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>SWIFT Message - Full Details</CardTitle>
        <CardDescription>MT103 - Single Customer Credit Transfer</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full rounded-md border p-4 bg-black text-white font-mono">
          <pre className="whitespace-pre-wrap break-words">
            {showRaw ? rawMessage : formattedMessage}
          </pre>
        </ScrollArea>
        <div className="mt-4 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setShowRaw(!showRaw)}
            className="text-sm"
          >
            {showRaw ? "Show Formatted" : "Show Raw"}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="text-sm"
          >
            Print Screen
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="text-sm text-muted-foreground">
          <p>This SWIFT message contains sensitive financial information.</p>
          <p>Please handle with care and in accordance with your institution's security policies.</p>
        </div>
      </CardContent>
    </Card>
  )
}

function generateUETR() {
  const hex = '0123456789abcdef'
  let uetr = ''
  for (let i = 0; i < 32; i++) {
    uetr += hex[Math.floor(Math.random() * 16)]
    if (i === 7 || i === 11 || i === 15 || i === 19) uetr += '-'
  }
  return uetr
}