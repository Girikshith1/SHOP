import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import './SizeGuideModal.css';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="sizeguide-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sizeguide-header">
          <div>
            <span className="mono-tag">PRECISION SIZING PROTOCOL</span>
            <h2 className="sizeguide-title">FIT & MEASUREMENTS</h2>
          </div>
          <button className="sizeguide-close" onClick={onClose} aria-label="Close size guide">
            <X size={22} />
          </button>
        </div>

        {/* Model Spec Banner */}
        <div className="model-spec-card">
          <div className="spec-indicator"></div>
          <div>
            <p className="spec-lead">MODEL INFORMATION</p>
            <p className="spec-body">
              Height: <strong>6'1" (185 cm)</strong> // Chest: <strong>39"</strong> // Wearing size <strong>LARGE (L)</strong> for signature boxy drape.
            </p>
          </div>
        </div>

        {/* Fit Explanation */}
        <div className="fit-explainer">
          <h4 className="fit-title">DON FIT ARCHITECTURE</h4>
          <p className="fit-p">
            All garments are engineered with our proprietary drop-shoulder silhouette, extended chest width, and structured heavyweight draping. If you prefer our intentional relaxed streetwear aesthetic, choose your <strong>true size</strong>. For an ultra-oversized runway volume, size up one step.
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="unit-toggle-row">
          <span className="mono-tag">MEASUREMENT UNIT:</span>
          <div className="unit-pills">
            <button
              className={`unit-btn ${unit === 'inches' ? 'active' : ''}`}
              onClick={() => setUnit('inches')}
            >
              INCHES (IN)
            </button>
            <button
              className={`unit-btn ${unit === 'cm' ? 'active' : ''}`}
              onClick={() => setUnit('cm')}
            >
              CENTIMETERS (CM)
            </button>
          </div>
        </div>

        {/* Garment Measurements Table */}
        <div className="table-responsive">
          <table className="measurements-table">
            <thead>
              <tr>
                <th>SIZE</th>
                <th>CHEST (PIT TO PIT)</th>
                <th>LENGTH</th>
                <th>SHOULDER DROP</th>
                <th>SLEEVE</th>
              </tr>
            </thead>
            <tbody>
              {unit === 'inches' ? (
                <>
                  <tr>
                    <td><strong>S</strong></td>
                    <td>23.5"</td>
                    <td>28.5"</td>
                    <td>22.0"</td>
                    <td>9.0"</td>
                  </tr>
                  <tr>
                    <td><strong>M</strong></td>
                    <td>24.5"</td>
                    <td>29.5"</td>
                    <td>23.0"</td>
                    <td>9.5"</td>
                  </tr>
                  <tr className="recommended-row">
                    <td><strong>L</strong> <span className="rec-badge">POPULAR</span></td>
                    <td>26.0"</td>
                    <td>30.5"</td>
                    <td>24.5"</td>
                    <td>10.0"</td>
                  </tr>
                  <tr>
                    <td><strong>XL</strong></td>
                    <td>27.5"</td>
                    <td>31.5"</td>
                    <td>26.0"</td>
                    <td>10.5"</td>
                  </tr>
                  <tr>
                    <td><strong>XXL</strong></td>
                    <td>29.0"</td>
                    <td>32.5"</td>
                    <td>27.5"</td>
                    <td>11.0"</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td><strong>S</strong></td>
                    <td>60 cm</td>
                    <td>72 cm</td>
                    <td>56 cm</td>
                    <td>23 cm</td>
                  </tr>
                  <tr>
                    <td><strong>M</strong></td>
                    <td>62 cm</td>
                    <td>75 cm</td>
                    <td>58 cm</td>
                    <td>24 cm</td>
                  </tr>
                  <tr className="recommended-row">
                    <td><strong>L</strong> <span className="rec-badge">POPULAR</span></td>
                    <td>66 cm</td>
                    <td>77 cm</td>
                    <td>62 cm</td>
                    <td>25 cm</td>
                  </tr>
                  <tr>
                    <td><strong>XL</strong></td>
                    <td>70 cm</td>
                    <td>80 cm</td>
                    <td>66 cm</td>
                    <td>27 cm</td>
                  </tr>
                  <tr>
                    <td><strong>XXL</strong></td>
                    <td>74 cm</td>
                    <td>83 cm</td>
                    <td>70 cm</td>
                    <td>28 cm</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Visual Fit Guide Checklist */}
        <div className="fit-checklist">
          <div className="check-item">
            <Check size={16} className="check-icon" />
            <span>Pre-shrunk custom heavyweight combed yarns. Shrinkage under 1.5% after wash.</span>
          </div>
          <div className="check-item">
            <Check size={16} className="check-icon" />
            <span>High-density 1.25" rib-knit collar designed to never sag or bacon-neck.</span>
          </div>
          <div className="check-item">
            <Check size={16} className="check-icon" />
            <span>Seamless exchanges within 7 days across India if fit is unsatisfactory.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
