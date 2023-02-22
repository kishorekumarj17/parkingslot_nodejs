const express = require("express");
const firebase =require('../models/db')
const router=express.Router();
const fireStore = firebase.firestore();
const sizesOrder=['s','m','l','xl']
// create a new parking lot
router.post("/newparkinglot",(req,res)=>{
    fireStore.collection('parkinglots').add(req.body).then((data)=>{
        res.send("Created New Parking Slot "+JSON.stringify(data.id))
    }).catch((err)=>{
        res.status(403).send('Error in storing data')
    })   
})

// Get a slot in parking lot
router.get("/getslot/:pid/:size",async (req,res)=>{
    var docref=fireStore.collection('parkinglots').doc(req.params.pid)
    var slotsref=fireStore.collection('slots')
    let response=""
    await fireStore.runTransaction(async (t)=>{
        const doc= await t.get(docref)
        let obj=doc.data()
        let reqSize=req.params.size
        // identify the available size for the requested size
        if(obj.slotsSize[reqSize]>0)
        {
            reqSize=reqSize
        }
        else
        {
            let index=sizesOrder.indexOf(reqSize)+1
            let sizeFound=false;
            for(let i=index;i<sizesOrder.length;i++)
            {
                if(obj.slotsSize[sizesOrder[i]]>0)
                {
                    reqSize=sizesOrder[i]
                    sizeFound=true;
                    break;
                }
            }
            if(sizeFound==false)
            {
                return "NO SLOT FOUND"
            }
        }
        // updating the parking slot and generating floor&bayID
        obj.slotsSize[reqSize]=obj.slotsSize[reqSize]-1;
        let keys=Object.keys(obj.floorSize)
        let currentFloor=0;
        for(let i=0;i<keys.length;i++)
        {
            if(obj.floorSize[keys[i]][reqSize]>0)
            {
                obj.floorSize[keys[i]][reqSize]=obj.floorSize[keys[i]][reqSize]-1;
                currentFloor=parseInt(keys[i])+1
                break;
            }
        }
        
        await t.update(docref,obj)
        return {parkingSlotId:doc.id,floorNo:currentFloor,size:reqSize}

    }).then(async (data)=>{
        if(data!="NO SLOT FOUND")
        {
            await slotsref.add(data).then((resData)=>{
                response="Floor No :"+data.floorNo+" BayId :"+resData.id
            })
        }
        else
        {
            response=data
        }
    })
   
    res.send(response)
    
})
//releasing the assigned space in a parking lot
router.get("/releaseslot/:pid/:slotid",async (req,res)=>{
    let slotref=fireStore.collection('slots').doc(req.params.slotid)
    let parkingref=fireStore.collection('parkinglots').doc(req.params.pid)
    let response=""
    await fireStore.runTransaction(async (t)=>{
        const slot=await t.get(slotref)
        let slotData=slot.data()
        const parking= await t.get(parkingref)
        let parkingData= parking.data()
        parkingData.slotsSize[slotData.size]=parkingData.slotsSize[slotData.size]+1
        parkingData.floorSize[(slotData.floorNo-1).toString()][slotData.size]=parkingData.floorSize[(slotData.floorNo-1).toString()][slotData.size]+1
        await t.update(parkingref,parkingData)
        return parkingData
    }).then(async (resData)=>{
        await slotref.delete().then((response)=>{
            response=JSON.stringify(resData)
        })
    })
    res.send("Successfully Released Record "+response)
})

module.exports=router