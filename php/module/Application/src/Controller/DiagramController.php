<?php
/**
 * Created by PhpStorm.
 * User: mfuesslin
 * Date: 21.03.2017
 * Time: 12:50
 */

namespace Application\Controller;


use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class DiagramController extends AbstractActionController
{
    public function getAction()
    {
        $jsonModel = [
            "result" => false
        ];

        $diagram = urldecode($this->params()->fromRoute('diagram', false));
        $file = "public/workspace/" . $diagram;

        if ($diagram && is_file($file)) {
            $jsonModel["result"] = true;
            $jsonModel['xml'] = file_get_contents($file);
        }

        return new JsonModel($jsonModel);
    }

    public function saveAction()
    {
        $jsonModel = [
            "result" => false
        ];

        $diagram = urldecode($this->params()->fromRoute('diagram'));
        $diagram = str_replace("\\", "/", $diagram);
        $diagram = str_replace("../", "", $diagram);
        $diagram = trim($diagram, "/");

        $folder = dirname($diagram);

        if ($folder !== ".") {
            $folder = 'public/workspace/'.$folder;
            if (!is_dir($folder)) {
                mkdir($folder, null, true);
            }
        }


        if ($this->request->isPost()) {
            $xml = $this->params()->fromPost('xml', false);

            if ($xml) {
                $file = "public/workspace/" . $diagram;

                if (file_put_contents($file, $xml)) {
                    $jsonModel["result"] = true;
                }
            }
        }

        return new JsonModel($jsonModel);
    }
}