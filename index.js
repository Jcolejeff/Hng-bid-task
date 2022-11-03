const csv = require("csvtojson");
const sha256 = require("js-sha256").sha256;
const fs = require("fs");
const { parseAsync } = require("json2csv");

// const csvFilePath = "HNGi9 CVS FILE - Sheet1.csv";
const filePath = process.argv[2] || "HNGi9 CVS FILE - Sheet1.csv";

async function convertFile(csvFilePath) {
	console.log(csvFilePath);
	if (!csvFilePath) {
		return console.log("please provide a valid file path");
	}
	const jsonArray = await csv().fromFile(csvFilePath);
	// console.log(jsonArray);
	const newJsonArray = jsonArray.map((record) => {
		const sha256_for_each_row = sha256(record.UUID);
		return {
			...record,
			hash: sha256_for_each_row,
		};
	});

	const CSV_OUTPUT = `${csvFilePath.split(".")[0]}.output.csv`;
	// create csv string
	const csvOutput = await parseAsync(newJsonArray);

	// write csv string to file
	fs.writeFile(CSV_OUTPUT, csvOutput, { encoding: "utf8" }, (err2) => {
		if (err2) {
			console.error("Error occured: ", err2);
			return;
		}

		console.log(
			`Output CSV generated successfully at ${__dirname}\\${CSV_OUTPUT}`
		);
	});
}

convertFile(filePath);
