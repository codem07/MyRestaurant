import React from 'react';

export interface ReservationManagerProps {
  reservations?: { id: string; name: string; time: string }[];
  onAddReservation?: () => void;
  onRemoveReservation?: (id: string) => void;
}

const ReservationManager: React.FC<ReservationManagerProps> = ({ reservations = [], onAddReservation, onRemoveReservation }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Reservation Manager</h2>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-2" onClick={onAddReservation}>Add Reservation</button>
      <ul>
        {reservations.map((res) => (
          <li key={res.id} className="flex justify-between py-1">
            <span>{res.name} - {res.time}</span>
            <button className="text-red-500" onClick={() => onRemoveReservation?.(res.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationManager; 