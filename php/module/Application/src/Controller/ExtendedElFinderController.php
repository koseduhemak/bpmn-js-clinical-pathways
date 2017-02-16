<?php
/**
 * Created by PhpStorm.
 * User: mfuesslin
 * Date: 16.02.2017
 * Time: 12:55
 */

namespace Application\Controller;


use Reliv\ElFinder\Controller\IndexController;

class ExtendedElFinderController extends IndexController
{
    public function folderAction() {
        $view = $this->init();
        $view->setTemplate('application/index/elFinder-folder');
        return $view;
    }
}