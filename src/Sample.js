import React, { useState } from 'react';

function CheckboxExample() {
  const [checkboxes, setCheckboxes] = useState({
    yuvaraj: false,
    sachin: false,
    sehwag: false
  });

  const handleChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxes({ ...checkboxes, [id]: checked });
    console.log(`${id} is ${checked ? "checked" : "unchecked"}`);
  };

  const handleSelectAll = (event) => {
    // console.log(event.target.checked)
    
    const checked = event.target.checked;
    const updatedCheckboxes = {};
    for (let key in checkboxes) {
      updatedCheckboxes[key] = checked;
    }
    console.log(updatedCheckboxes);
    setCheckboxes(updatedCheckboxes);
  };

  return (
    <div>
      <div>Select All<input type="checkbox" onChange={handleSelectAll} /></div>
      <div>
        <label htmlFor="yuvaraj">Yuvaraj</label>
        <input type="checkbox" id="yuvaraj" checked={checkboxes.yuvaraj} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="sachin">Sachin</label>
        <input type="checkbox" id="sachin" checked={checkboxes.sachin} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="sehwag">Sehwag</label>
        <input type="checkbox" id="sehwag" checked={checkboxes.sehwag} onChange={handleChange} />
      </div>
    </div>
  );
}

export default CheckboxExample;
