import './ManageOffers.css';

import { useState } from 'react';

import { generateInitialOffers } from './ManageOffers.data';
import type { OfferGridRow } from './ManageOffers.types';
import { CreateNewOfferDrawer } from './components/CreateNewOfferDrawer';
import { OffersGrid } from './components/OffersGrid';

export function ManageOffers() {
  const [offers, setOffers] = useState<OfferGridRow[]>(generateInitialOffers);
  const [isShowingCreateNew, setIsShowingCreateNew] = useState(false);

  const handleOfferCreated = (newOffer: OfferGridRow) => {
    setOffers((prev) => [newOffer, ...prev]);
  };

  return (
    <div style={{ height: '99%', width: '100%' }}>
      <OffersGrid rowData={offers} onCreateNew={() => setIsShowingCreateNew(true)} />
      <CreateNewOfferDrawer
        open={isShowingCreateNew}
        onClose={() => setIsShowingCreateNew(false)}
        onOfferCreated={handleOfferCreated}
      />
    </div>
  );
}
