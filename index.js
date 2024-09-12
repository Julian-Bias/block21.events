const COHORT = "2407-FTB-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events/`;

const state = {
  events: [],
};

// build html, then create and add event listeners below
const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

//sync state with API and re-render
async function render() {
  await getEvents();
  renderEvents();
}

//update with events from api
async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log(json.data);
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

//form submission handler
async function addEvent(event) {
  event.preventDefault();

  const name = addEventForm.title.value;
  const date = addEventForm.dateInput.value;
  const time = addEventForm.time.value;
  const location = addEventForm.location.value;
  const description = addEventForm.description.value;

  const combinedDateTime = `${date}T${time}:00.000Z`;

  console.log("Adding event with data:", {
    name,
    combinedDateTime,
    location,
    description,
  });

  //call function to be re-rendered
  await createEvent(name, combinedDateTime, location, description);
  render();
}

//ask api to create new event and rerender
async function createEvent(name, combinedDateTime, location, description) {
  const eventData = {
    name,
    description,
    date: combinedDateTime,
    location,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error("Failed to create Event");
    }

    const result = await response.json();
    console.log("Event created successfully:", result);

    await getEvents();
    renderEvents();
  } catch (error) {
    console.error("Error creating event:", error);
  }
}

//ask api to update events and rerender(currently not being used)
async function updateEvent(name, combinedDateTime, location, description) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

//ask API to delete an event and rerender using the id
async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }

    console.log(`Event with id ${id} deleted successfully`);
    renderEvents();
  } catch (error) {
    console.error("Error deleting event");
  }
}

//render events from the state
function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML =
      /*html*/
      `<li>No events found.</li>`;
    return;
  }

  const eventDetails = state.events.map((event) => {
    const eventDetail = document.createElement("li");
    eventDetail.classList.add("events");
    eventDetail.innerHTML = /*html*/ `
    <h2>${event.name}</h2>
    <li>${event.date}</li>
    <li>${event.time}</li>
    <li>${event.location}</li>
    <li>${event.description}</li>
    `;

    //add delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    eventDetail.append(deleteButton);

    //add listener for delete button
    deleteButton.addEventListener("click", () => deleteEvent(event.id));

    return eventDetail;
  });
  eventList.replaceChildren(...eventDetails);
}
render();
