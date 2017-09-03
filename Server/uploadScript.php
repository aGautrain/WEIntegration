<?php

header("Content-type: application/json");

if(!isset($_FILES["picture"])){
	$jsonResult = array('success' => false, 'message' => utf8_encode('No file provided.'));
	echo json_encode($jsonResult);
} else {
	
	$target_dir = "imgs/";
	$extension = strtolower(pathinfo($_FILES['picture']['name'], PATHINFO_EXTENSION));
	$target_file = uniqid() . "." . $extension;
	$target_file_full = $target_dir . $target_file;
	
	// Checking file extension
	if($extension != "png" && $extension != "jpg" && $extension != "jpeg" && $extension != "gif"){
		$jsonResult = array('success' => false, 'message' => utf8_encode('Only JPEG, JPG, PNG and GIF extensions are tolerated.'));
		echo json_encode($jsonResult);
	} else {

		// Checking size
		if($_FILES["picture"]["size"] > 10000000){
			
			$jsonResult = array('success' => false, 'message' => utf8_encode('Picture size must not be greater than 10 mega.'));
			echo json_encode($jsonResult);
			
		} else {

			$check = getimagesize($_FILES["picture"]["tmp_name"]);

			// Checking image type
			if($check !== false){
				
				// Uploading if all went correct
				if(move_uploaded_file($_FILES["picture"]["tmp_name"], $target_file_full)){
					$jsonResult = array('success' => true, 'message' => utf8_encode('Picture uploaded with success !'), 'url' => $target_file);
					echo json_encode($jsonResult);
				} else {
					$jsonResult = array('success' => false, 'message' => utf8_encode('Problem during upload. If problem persists, please consider contacting administrator.'));
					echo json_encode($jsonResult);
				}
				
			} else {
				$jsonResult = array('success' => false, 'message' => utf8_encode('File provided is not a picture.'));
				echo json_encode($jsonResult);
			}
		}

	}
}