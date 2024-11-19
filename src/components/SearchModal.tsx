import React from "react";

type SearchModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
	if (!isOpen) return null;

	return (
		<>
			<div className="fixed inset-0 bg-blue-100 z-40" onClick={onClose}></div>
			<div className="fixed inset-0 flex items-center justify-center z-50">
				<div className="bg-white p-8 rounded-lg shadow-lg relative max-w-lg mx-auto">
					<button title="Close" className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none" onClick={onClose}>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
					<input type="text" placeholder="Buscar..." className="w-full px-6 py-4 bg-gray-100 text-black rounded-md text-lg focus:outline-none focus:ring-0" />
				</div>
			</div>
		</>
	);
};

export default SearchModal;
