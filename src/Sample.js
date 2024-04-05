import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import { Link } from 'react-router-dom';

function Sample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        Click me
      </Button>
      <Collapse in={open}>
        <div id="example-collapse-text">
          <div>
            <a href='/employee'>Add Timesheet</a>
          </div>
          <div>
            <a>Reject Timesheet</a>
          </div>
          <div>
            <a>Edit Timesheet</a>
          </div>

        </div>
      </Collapse>
    </>
  );
}

export default Sample;
