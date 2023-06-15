import { Alert, Modal, Button } from 'react-bootstrap';
import { read, utils } from 'xlsx';
import './App.css';
import { useState } from 'react';

function App() {

  // table data
  const [tableData, setTableData] = useState();

  // uploaded data
  const [uploadedData, setUploadedData] = useState();

  // show/hide modal
  const [show, setShow] = useState(false);

  function showModal() {
    setShow(true);
  }

  function hideModal() {
    setShow(false);
  }

  // file reader
  const readFile = ($event) => {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          setUploadedData(rows);
        }
      }
      reader.readAsArrayBuffer(file);
    }
  }

  // merge data
  function verifyData() {
    setShow(false);

    let newData;

    if (tableData == null) {
      newData = uploadedData;
    }
    else {
      // function to combine array of objccts and remove duplicates
      // however, this function is only able to check duplicates of the Name column
      // the best way to ensure no duplicates and clean data would be for the dataset to have a unique id for each student
      // if there is an id, then that should be the iteratee
      const myUnionBy = (arrays, iteratee) => {
        const map = {};

        arrays.forEach((array) => {
          array.forEach((object) => {
            map[object[iteratee]] = object;
          });
        });

        return Object.values(map);
      };

      newData = myUnionBy([tableData, uploadedData], 'Name');
    }

    setTableData(newData);
  }

  return (
    <div className='page-background'>
      <div className='page-content'>
        <p className='page-title'>Students Information</p>

        <div className='button-content'>
          <Button variant='primary' onClick={showModal}>Upload</Button>
        </div>

        <div className='table-content'>
          <table className='table-data'>
            <thead>
              <tr>
                <th style={{ width: "fit-content" }}>No.</th>
                <th>Name</th>
                <th>Class</th>
                <th>Level</th>
                <th>Parents' contact no.</th>
              </tr>
            </thead>
            <tbody>
              {/* check if table data is empty or not */}
              {
                !tableData || tableData.length < 1
                  // if empty, show message
                  ? <tr>
                    <td colSpan={5}><Alert className='alert-message' variant='danger'>No information has been uploaded</Alert></td>
                  </tr>
                  // if not, display data
                  : tableData.map((data, index) =>
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data['Name']}</td>
                      <td>{data['Class']}</td>
                      <td>{data['Level']}</td>
                      <td>{data['Parent Contact']}</td>
                    </tr>
                  )
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* modal to upload file */}
      <Modal show={show} onHide={hideModal} size='sm' aria-labelledby='contained-modal-title-vcenter' centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload from file</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* input only accepts spreadsheets */}
          <input onChange={readFile} type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={verifyData}>Upload</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
