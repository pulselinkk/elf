(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  const service = params.get("service");
  const timeline = params.get("timeline");
  const details = params.get("details");

  if (!service && !timeline && !details) return;

  const serviceField = document.getElementById("service");
  const timelineField = document.getElementById("timeline");
  const detailsField = document.getElementById("details");

  if (serviceField && Array.from(serviceField.options).some(option => option.value === service)) serviceField.value = service;
  if (timelineField && Array.from(timelineField.options).some(option => option.value === timeline || option.text === timeline)) timelineField.value = timeline;
  if (detailsField && details) detailsField.value = details;
})();
