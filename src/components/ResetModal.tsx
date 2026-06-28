/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AlertTriangle } from "lucide-react";

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" id="reset-modal">
      <div className="modal-card">
        <div className="modal-icon text-red">
          <AlertTriangle className="h-9 w-9 text-red-600 inline-block" strokeWidth={2.5} />
        </div>
        <h3 className="modal-title">تنبيه تأكيد إعادة المحاولة</h3>
        <p className="modal-desc">هل أنت متأكد من رغبتك في حذف جميع إجاباتك السابقة، تقييماتك الذاتية، ومستويات تمكنك وبدء محاولة نظيفة تماماً من الصفر؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onConfirm}>نعم، تصفير التقدم</button>
          <button className="btn btn-secondary" onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </div>
  );
};
