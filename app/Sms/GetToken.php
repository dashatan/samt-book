<?php
namespace App\Sms;

class GetToken{

    /**
     * gets Api Token Url.
     *
     * @return string Indicates the Url
     */
    protected function getApiTokenUrl(){
        return "https://api.sms.ir/users/v1/Token/GetToken";
    }

    /**
     * gets config parameters for sending request.
     *
     * @param string $APIKey API Key
     * @param string $SecretKey Secret Key
     * @return void
     */
    public function __construct($APIKey,$SecretKey){
        $this->APIKey = $APIKey;
        $this->SecretKey = $SecretKey;
    }

    /**
     * gets token key for all web service requests.
     *
     * @return string Indicates the token key
     */
    public function GetToken(){
        $postData = array(
            'UserApiKey' => $this->APIKey,
            'SecretKey' => $this->SecretKey
        );
        $postString = json_encode($postData);
        $ch = curl_init($this->getApiTokenUrl());
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_POST, count($postData));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postString);

        $result = curl_exec($ch);
        curl_close($ch);

        $response = json_decode($result);
        if(is_object($response)){
            if($response->IsSuccessful == true){
                @$resp = $response->TokenKey;
            } else {
                $resp = $response->Message;
            }
        }

        return $resp;
    }
}
