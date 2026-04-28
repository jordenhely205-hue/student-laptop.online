"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./challan.module.css";

export default function ChallanPage() {
  const [data, setData] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [tid, setTid] = useState("");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("challanData");
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        // Fallback
        setData({
          name: "AIMAN KHAN",
          fatherName: "ABDUL REHMAN",
          cnic: "42101-2345678-0",
          boardOrUniversity: "UNIVERSITY OF KARACHI"
        });
      }
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tid || !receiptImage) {
      alert("Please enter Transaction ID and upload the screenshot.");
      return;
    }
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      localStorage.setItem("paymentProof", JSON.stringify({
        tid,
        image: receiptImage,
        timestamp: new Date().toISOString()
      }));
      setShowUploadModal(false);
      alert("Your payment proof has been submitted. Status will be updated after verification.");
    }, 1500);
  };

  if (!data) return <div className="container" style={{padding: "2rem", textAlign: "center"}}>Loading...</div>;

  const ChallanCopy = ({ type }: { type: string }) => (
    <div className={styles.challanBox}>
      <div className={styles.header}>
        <div className={styles.logoArea}>
          <img src="/logo.png" alt="Student Laptop Scheme Logo" width="150" height="50" style={{objectFit: "contain"}} />
        </div>
        <div className={styles.metaArea}>
          Date: {new Date().toLocaleDateString('en-GB')}<br />
          Challan No: SL-{new Date().getFullYear()}-{data.cnic.split("-").join("").slice(0, 5)}<br />
          Application ID: APP-{data.cnic.split("-").join("").slice(5, 10)}
        </div>
      </div>

      <div className={styles.titleBar}>
        FEE PAYMENT CHALLAN - STUDENT LAPTOP SCHEME 2026
      </div>
      <div className={styles.subTitleBar}>
        REGISTRATION FEE (NON-REFUNDABLE)
        <span className={styles.copyType}>{type}</span>
      </div>

      <div className={styles.detailsSplit}>
        <table className={styles.tableBlock}>
          <tbody>
            <tr>
              <td className={styles.labelCell}>Student Name</td>
              <td className={styles.valueCell}>{data.name.toUpperCase()}</td>
            </tr>
            <tr>
              <td className={styles.labelCell}>Father's Name</td>
              <td className={styles.valueCell}>{data.fatherName.toUpperCase()}</td>
            </tr>
            <tr>
              <td className={styles.labelCell}>CNIC</td>
              <td className={styles.valueCell}>{data.cnic}</td>
            </tr>
            <tr>
              <td className={styles.labelCell}>{data.level === "Inter" ? "Board" : "University"}</td>
              <td className={styles.valueCell}>{data.boardOrUniversity.toUpperCase()}</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.feeBlock}>
          <table className={styles.tableBlock}>
            <tbody>
              <tr>
                <td className={styles.labelCell}>Purpose</td>
                <td className={styles.valueCell}>REGISTRATION FEE</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>Amount</td>
                <td className={styles.valueCell}>Rs. 475/-</td>
              </tr>
              <tr>
                <td className={styles.labelCell}>Amount in Words</td>
                <td className={styles.valueCell}>Four Hundred Seventy-Five Rupees Only</td>
              </tr>
            </tbody>
          </table>
          
          <div style={{textAlign: "center", marginTop: "1rem"}}>
            <img src="/qr_code_clean.png" alt="QR Code" width="160" style={{border: "1px solid #ccc", padding: "5px", borderRadius: "8px"}} />
            <div style={{marginTop: "0.5rem", fontSize: "0.9rem", fontWeight: "bold"}}>Merchant: Student Laptop Online</div>
            <div style={{fontSize: "1.2rem", color: "#b91c1c", fontWeight: "bold"}}>Till ID: 983191782</div>
          </div>
        </div>
      </div>

      <div className={styles.footerSplit}>
        <div className={styles.instructions}>
          <strong>Instructions for Payment</strong>
          <ol>
            <li><strong>Payment Method:</strong> JazzCash / Raast / Any Banking App (Via QR Scan)</li>
            <li>Select 'Pay to Merchant' / 'Till Payment' or scan QR code.</li>
            <li>Enter <strong>Till ID: 983191782</strong>.</li>
            <li>Pay <strong>Rs. 475</strong>.</li>
            <li>Enter Transaction ID (TID) and upload screenshot on website: studentlaptop.online</li>
          </ol>
          <p style={{fontSize: "0.75rem", color: "#b91c1c", marginTop: "0.5rem", fontWeight: "bold"}}>
            Please verify the Merchant Name 'Student Laptop Online' before completing the payment.
          </p>
        </div>
        <div className={styles.signatures}>
           <div className={styles.sigLine}>Depositor</div>
           <div className={styles.sigLine}>Authorized Officer/Bank Stamp</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <header className={styles.pageHeader}>
        <div className="container" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
           <div className={styles.logo}>
             <img src="/logo.png" alt="Student Laptop Scheme Logo" width="200" height="66" style={{objectFit: "contain"}} />
           </div>
           <div>
             <button onClick={() => setShowUploadModal(true)} className="btn" style={{backgroundColor: "#f59e0b", color: "white", marginRight: "1rem"}}>Upload Paid Receipt</button>
             <button onClick={handlePrint} className="btn btn-secondary" style={{marginRight: "1rem"}}>Print Challan</button>
             <Link href="/" className="btn btn-primary">Done</Link>
           </div>
        </div>
      </header>
      
      <main className={`container ${styles.mainContent}`}>
         <div className={styles.printArea}>
           <ChallanCopy type="OFFICE COPY" />
           <div className={styles.verticalScissor}>
             <div className={styles.scissorIcon}>✂</div>
           </div>
           <ChallanCopy type="STUDENT COPY" />
         </div>
      </main>

      {showUploadModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.75)", zIndex: 999,
          display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem"
        }}>
          <div style={{backgroundColor: "white", padding: "2rem", borderRadius: "12px", maxWidth: "500px", width: "100%", position: "relative"}}>
            <button 
              onClick={() => setShowUploadModal(false)}
              style={{position: "absolute", top: "1rem", right: "1rem", background: "#f1f5f9", border: "none", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", fontWeight: "bold"}}
            >×</button>
            <h2 style={{marginBottom: "1.5rem", color: "#1e3a8a"}}>Submit Payment Proof</h2>
            <form onSubmit={submitProof}>
              <div style={{marginBottom: "1.5rem"}}>
                <label style={{display: "block", marginBottom: "0.5rem", fontWeight: "bold"}}>Transaction ID (TID) *</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Enter TID from SMS/App" 
                  value={tid} 
                  onChange={(e) => setTid(e.target.value)} 
                  required 
                />
              </div>
              <div style={{marginBottom: "1.5rem"}}>
                <label style={{display: "block", marginBottom: "0.5rem", fontWeight: "bold"}}>Upload Screenshot / Receipt *</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="input" 
                  onChange={handleImageUpload} 
                  required 
                  style={{padding: "0.5rem"}}
                />
                {receiptImage && (
                  <div style={{marginTop: "1rem", textAlign: "center"}}>
                    <img src={receiptImage} alt="Receipt Preview" style={{maxHeight: "150px", border: "1px solid #ccc", borderRadius: "8px"}} />
                  </div>
                )}
              </div>
              <button type="submit" className="btn btn-primary" disabled={uploading} style={{width: "100%", padding: "0.75rem", fontSize: "1.1rem"}}>
                {uploading ? "Submitting..." : "Submit Proof"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
