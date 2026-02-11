"use client";

import { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (decodedText: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          onScan(decodedText);
        },
        (error) => {
          // ignore scan errors
        }
      )
      .catch(() => {});

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onScan]);

  return <div id="qr-reader" className="w-full max-w-md mx-auto" />;
}

