import React, { useState } from "react";

interface ModalAprobacionRechazoProps {
	isOpen: boolean;
	onClose: () => void;
	onApprove: () => void;
	onReject: () => void;
}

const ModalAprobacionRechazo: React.FC<ModalAprobacionRechazoProps> = ({ isOpen, onClose, onApprove, onReject }) => {
	const [isRejecting, setIsRejecting] = useState(false);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-md">
				<div className="p-6">
					<h2 className="text-2xl font-bold mb-4">¿Desea aprobar o rechazar la solicitud?</h2>
					<div className="flex justify-end gap-4">
						<button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
							Cancelar
						</button>
						<button
							onClick={async () => {
								setIsRejecting(true);
								try {
									await onReject();
								} finally {
									setIsRejecting(false);
									onClose();
								}
							}}
							disabled={isRejecting}
							className={`px-4 py-2 ${
								isRejecting ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
							} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
						>
							Rechazar
						</button>
						<button
							onClick={() => {
								onApprove();
								onClose();
							}}
							className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Aprobar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalAprobacionRechazo;
