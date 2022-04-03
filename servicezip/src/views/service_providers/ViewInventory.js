import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  CBadge,
  CImg,
  CInputGroup,
  CButton,
  CInput,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CLabel
} from "@coreui/react";
import firebase from "../../config/fbconfig";

const ViewInventory = (props) => {
  const history = useHistory();
  var [cat, setCat] = useState([]);
  const [tableFilters, setTableFilters] = useState({});
  const [loading, setLoading] = useState(false);

  const socData = Date.now() - (7*(24 * 60 * 60 * 1000));
  const curData = Date.now();
  var[order, setOrder] = useState(socData);
  var[porder, setPorder] = useState(curData);
  // const [details, setDetails] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  var [state, setState] = useState({
    videos: null,
  });

  useEffect(() => {
    getVideos();
  }, [refresh]);

  const getVideos = async () => {
    setLoading(true);
    const videos = await firebase.firestore().collection("products").doc(props.location.index).collection("inventory").where("date", ">=", order).where("date", "<=", porder).get();
    // console.log(videos.docs.length).;

    const resolvedVideos = videos.docs.map((video) => {
      const id = video.id;
      const videoData = video.data();

      return {
        ...videoData,
        id: id,
        ddate: new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(videoData.date),
          date: videoData.date,
          quanity:videoData.quanity,
        type:videoData.type
      };
    });

    // console.log(resolvedVideos);

    setState({
      ...state,
      videos: resolvedVideos,
    });
    setCat(resolvedVideos);
    setLoading(false);
    // console.log(videos);
  };
//   const getUnits = () =>{
//     cat.filter(x => x.id === 'data').map( sub =>{
//         return( 
          
//         )
//       })
//       console.log(cat);
//   }
  const deleteVideo = (rowId) => {
    confirmAlert({
      title: "Delete",
      message: "Are you sure to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: async() => {
            await firebase.firestore().collection("employee").doc(rowId).delete();
            setRefresh(!refresh);
                alert("Employee Deleted");
          },
        },
        {
          label: "No",
          // onClick: () => alert("Close"),
        },
      ],
      // childrenElement: () => <div />,
      // customUI: ({ onClose }) => <div>Custom UI</div>,
      closeOnEscape: true,
      closeOnClickOutside: true,
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {},
      // overlayClassName: "overlay-custom-class-name"
    });

  };

  var [ref, setRef] = useState();
  const handleChange = (e) => {
    setRef(e.target.value)
  }
  const onChangeDate =  (e) => {
    porder=new Date(document.getElementById("date-to").value).getTime();
    order=new Date(document.getElementById("date-from").value).getTime();
    getVideos();
  };
  const addSalary = (item, rowId) => {
    // console.log(item);
    confirmAlert({
      title: "Salary",
      message: (
        <CRow>
          <CCol sm={12}>
            <CLabel style={{ marginLeft: "15px" }} rows="3">
              Credit/Debit :
            </CLabel>
            <select
              style={{
                marginLeft: "21px",
                border: "1px solid #d8dbe0",
                borderRadius: "0.25rem",
                textAlign: "left",
              }}
              id="status"
              onChange={(e) => handleChange(e)}
            >
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </CCol>
          {/* <CCol sm={12}>
            <CLabel style={{ marginLeft: "15px" }} rows="3">
              Status :
            </CLabel>
            <select
              style={{
                marginLeft: "21px",
                border: "1px solid #d8dbe0",
                borderRadius: "0.25rem",
                textAlign: "left",
              }}
              id="dropdown"
            >
              <option value="Out Of Stock">Out Of Stock</option>
              <option value="Wrong Item">Wrong Item</option>
              <option value="Quality Issue">Quality Issue</option>
              <option value="Other">Other</option>
            </select>
          </CCol> */}
          <CLabel style={{ marginLeft: "15px" }}>Amount :</CLabel>
          <br></br>
          <div
            class="form-floating"
            style={{ marginLeft: "15px", color: "#333" }}
            rows="3"
          >
            <input 
              type="number"
              placeholder="Enter Amount"
              name="textarea"
              id="floatingTextarea"
            />
          </div>
        </CRow>
      ),
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            var ref =document.getElementById("status").value;
            await firebase
              .firestore()
              .collection("employee")
              .doc(rowId)
              .collection("salary")
              .add({
                date:Date.now(),
                amount: document.getElementById("floatingTextarea").value,
                type: document.getElementById("status").value,
              });
              ref=="Credit"?alert("Amount Credited Successfully!"):alert("Amount Debited Successfully!")
            // getUsers();
            // getPostorder();
            // getLorder();
            // getDeliverorder();
            // setRefresh(!refresh);
          },
        },
        {
          label: "No",
          // onClick: () => alert("Close"),
        },
      ],
      // childrenElement: () =>
      // customUI: ({ onClose }) => <div>Custom UI</div>,
      closeOnEscape: true,
      closeOnClickOutside: true,
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {},
      // overlayClassName: "overlay-custom-class-name"
    });
  };
  const edit = (rowId,index) => {
    history.push(
      {
      pathname: '/blogs/edit-employee',
      state: rowId,
      index: index
      }
    )
  };
  const hist = (rowId,index) => {
    history.push(
      {
      pathname: '/blogs/edit-employee',
      state: rowId,
      index: index
      }
    )
  };
  // const toggleDetails = (index) => {
  //   const position = details.indexOf(index);
  //   let newDetails = details.slice();
  //   if (position !== -1) {
  //     newDetails.splice(position, 1);
  //   } else {
  //     newDetails = [...details, index];
  //   }
  //   setDetails(newDetails);
  // };

  return (
    <CRow>
      {/* <CCol xl={1} /> */}
      <CCol>
        <CCard>
        {/* <CCardHeader style={{ fontWeight: "bold",backgroundColor:"#f7f7f7",fontSize:"1.1rem",color: "black"}}></CCardHeader> */}
        <CCardHeader
            className="d-flex justify-content-between align-items-center"
            style={{
              fontWeight: "bold",
              backgroundColor: "#f7f7f7",
              fontSize: "1.1rem",
              color: "black",
            }}
          >
              <CCol sm="4">
                    <div className="font-xl">Inventory History</div>
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        From:
                        <span><CInput type="date" id="date-from" name="date-input" placeholder="date"/></span>
                    </div>
                </CCol>
                <CCol sm="2">
                    <div style={{width:"160px",marginLeft:"5px"}}>
                        To:
                        <span><CInput type="date" id="date-to" name="date-input" placeholder="date" onChange={() => onChangeDate()}/></span>   
                    </div>
                </CCol>
                <CCol sm="1"></CCol>
                <CCol sm="2">
                    {/* <div>
                        <CButton
                            color="info"
                            className="mr-3"
                            onClick={() => onExportData()}
                        >
                            Export Data
                        </CButton>
                    </div> */}
                </CCol>
            
              {/* <CButton
                color="primary"
                // onClick={() => history.push("/users/create-user")}
              >
                Create User
              </CButton> */}
          </CCardHeader>  
          
          <CCardBody>
            {/* <CRow>
                <CDataTable
                    loading={loading}
                    onColumnFilterChange={(e) => {
                      setTableFilters(e);
                    }}
                    onSorterValueChange={(e) => {
                      console.log(e);
                    }}
                    onTableFilterChange={(filter) => setTableFilters(filter)}
                    items={state.videos}
                    fields={[
                      { key: "wallet", label: "Base Salary", filter: false },
                      { key: "online", label: "Overall Transaction", filter: false },
                    //   { key: "cod", label: "COD", filter: false },
                    //   { key: "gpay", label: "Gpay", filter: false },
                    //   { key: "phonepay", label: "Phone Pay", filter: false },
                    //   { key: "paytm", label: "Paytm", filter: false },
                    //   { key: "bank", label: "Bank Transfer", filter: false },
                    ]}
                    scopedSlots={{
                        wallet: (item,index) => {
                            return (
                                index == 0?<td><b>₹</b>{props.location.state.baseSalary}</td>:
                            <td hidden>
                            </td>
                            );
                        },
                        online: (item,index) => {
                            let wallet = 0;
                                cat.map((sub)=>{
                                    if(sub.type === "Credit"){
                                        wallet = wallet + sub.amount;
                                    }else
                                        wallet = wallet - sub.amount;
                                })
                            return (
                                index == 0?<td><b>₹</b>{wallet}</td>:
                                <td hidden>
                                </td>
                            );
                        },
                    }}
                    hover
                    striped
                    clickableRows
                />
            </CRow> */}
            <CRow>
                <CDataTable style={{border:"1px solid #ebedf0"}}
                loading={loading}
                onTableFilterChange={(filter) => setTableFilters(filter)}
                items={state.videos}
                fields={[
                    { key: "srno", label: "Sr. No.", filter: true },
                    { key: "ddate", label: "Date", filter: true },
                    { key: "type", label: "Type", filter: true },
                    { key: "quanity", label: "Quanity", filter: true },
                ]}
                scopedSlots={{
                    srno: (item, index) => {
                    return (
                        <td>
                            {index+1}
                        </td>
                    );
                    },
                    ddate: (item) => {
                        return (
                        <td>
                            <div>{item.ddate}</div>
                            <div>
                            {new Intl.DateTimeFormat("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                            }).format(item.date)}
                            </div>
                        </td>
                        );
                    },
                    type: (item) => (
                    <td>
                        {item.type}
                    </td>
                    ),
                    quanity: (item) => (
                    <td>
                        {item.quanity}
                    </td>
                    ),
                    //   details: (item) => {
                    //     console.log(item);
                    //     return (
                    //       <CCollapse visible="true">
                    //         <CCardBody>
                    //           <h4>Description</h4>
                    //           <p className="text-muted">{item.descriptioin}</p>
                    //           <CButton size="sm" color="info">
                    //             User Settings
                    //           </CButton>
                    //           <CButton size="sm" color="danger" className="ml-1">
                    //             Delete
                    //           </CButton>
                    //         </CCardBody>
                    //       </CCollapse>
                    //     );
                    //   },
                }}
                hover
                striped
                columnFilter
                pagination
                // tableFilter
                sorter
                // itemsPerPageSelect
                itemsPerPage={30}
                clickableRows
                //   onRowClick={(item) => history.push(`/users/${item.id}`)}
                />
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CCol xl={1} /> */}
    </CRow>
  );
};

export default ViewInventory;
