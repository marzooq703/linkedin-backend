const express = require("express");
const axios = require("axios");
const app = express();
const querystring = require("querystring");
app.use(express.json());

const getAccessCode = async (code) => {
	let result;
	let url = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=https://one-fm-job-application-portal.vercel.app/form.html&client_id=78q6xv6hcsf430&client_secret=PVnMPHKawL5UBgRD`;
	axios
		.post(url)
		.then(async (res) => {
			console.log(`statusCode: ${res.statusCode}`);
			console.log("res", res.data);
			result = await res.data;
		})
		.catch(async (error) => {
			result = await error.response.data;
			console.error("error", result);
		});
	setTimeout(() => {
		console.log("result", result);
		return result;
	}, 2000);
};
app.get("/", (req, res) => {
	res.send("Linked In Api for One FM job application");
});
app.post("/api/accessCode", (request, response) => {
	// getAccessCode(req.body.code).then((a) => {
	// 	res.send(a);
	// });
	let url = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${request.body.code}&redirect_uri=https://dev.one-fm.com/applicant-docs&client_id=78q6xv6hcsf430&client_secret=PVnMPHKawL5UBgRD`;
	axios
		.post(url)
		.then((res) => {
			axios
				.get("https://api.linkedin.com/v2/me", {
					headers: {
						Authorization: `Bearer ${res.data.access_token}`,
					},
				})
				.then(function (re) {
					// handle success
					response.send(re.data);
					console.log(re.data);
				})
				.catch(function (error) {
					// handle error
					console.log("get error", error);
					response.send(re.response.data);
				});
		})
		.catch((error) => {
			response.send(error.response.data);
		});
});

app.listen(8080, () => console.log("Listening on port 8080..."));
