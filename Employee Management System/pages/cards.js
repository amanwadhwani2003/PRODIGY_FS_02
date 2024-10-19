import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Searchnav from "./components/Searchnav";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CardsPage() {
  const [filteredData, setFilteredData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const router = useRouter();
  const { search } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (search) {
          const response = await fetch(`/api/users?search=${search}`);
          const data = await response.json();
          setFilteredData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [search]);

  const handleFetchDetails = (user) => {
    setSelectedUser(user);
    setUpdatedData({ city: user.city }); // Initialize updated data
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert("User updated successfully!");
        setFilteredData(
          filteredData.map((user) =>
            user.contact_number === id ? { ...user, ...updatedData } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = (user) => {
    console.log(user); // Check the user object
    fetch(`/api/users?first_name=${user.first_name}&last_name=${user.last_name}&city=${user.city}`, {
      method: 'DELETE',
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message);
      // Update the state or UI to reflect the deleted user
    })
    .catch((error) => {
      console.error('Failed to delete', error);
    });
  };
  
  

  return (
    <>
      <Searchnav />
      <div className="cards-container">
        {filteredData.length > 0 ? (
          filteredData.map((user) => (
            <div className="card flex flex-col justify-between" key={user.contact_number}>
              <div className="card-header">
                <div className="image">
                  <Image
                    className="card-image"
                    src="/media/ProfileImage.jpg"
                    alt="Profile Image"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="name">{`${user.first_name} ${user.last_name}`}</div>
                <div className="location flex">
                  <Image src="/media/location.svg" alt="Location" width={15} height={15} /> {user.city}
                </div>
              </div>
              <span className="w-full border-slate-200 border-2"></span>
              <div className="card-footer-div flex justify-between">
                <div>
                  <div className="contact-number flex gap-1">
                    <Image src="/media/call.svg" alt="Contact" width={17} height={17} /> {user.contact_number}
                  </div>
                  <div className="availability text-xs text-gray-600">Available on Phone</div>
                </div>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-white bg-black font-normal px-2 py-2 text-xs rounded-md hover:bg-gray-800"
                        onClick={() => handleFetchDetails(user)}
                      >
                        Fetch Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Fetch Details</DialogTitle>
                        <DialogDescription>Here are the details of the following employee.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-2 py-2">
                        {selectedUser && (
                          <div className="grid grid-cols-1 items-center gap-0">
                            <div className="detail-item">First Name: {selectedUser.first_name}</div>
                            <div className="detail-item">Last Name: {selectedUser.last_name}</div>
                            <div className="detail-item">City: {selectedUser.city}</div>
                            <div className="detail-item">Contact Number: {selectedUser.contact_number}</div>
                            <div className="detail-item py-3">
                              Profile Image: <Image src={"/media/ProfileImage.jpg"} alt="Profile Image" width={140} height={140} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="py-3">
                        {/* Input fields to update */}
                        <input
                          type="text"
                          name="city"
                          placeholder="Update City"
                          onChange={(e) => setUpdatedData({ ...updatedData, city: e.target.value })}
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={() => handleUpdate(selectedUser.contact_number)}>Update</Button>
                        <Button onClick={() => deleteUser(selectedUser.contact_number)}>Delete</Button>
                        <DialogPrimitive.Close className="text-red-500 hover:text-red-700">Close</DialogPrimitive.Close>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h3>No Users Found</h3>
        )}
      </div>
    </>
  );
}
