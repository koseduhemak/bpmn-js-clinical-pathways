<?php
/**
 * Index Controller Factory
 *
 * This file contains the factory for the main controller used for the application.
 *
 * PHP version 5.3
 *
 * LICENSE: No License yet
 *
 * @category  Reliv
 * @author    Unkown <unknown@relivinc.com>
 * @copyright 2012 Reliv International
 * @license   License.txt New BSD License
 * @version   GIT: <git_id>
 */
namespace Application\Factory\Controller;

use Application\Controller\ExtendedElFinderController;
use Interop\Container\ContainerInterface;
use Reliv\ElFinder\Controller\IndexController;
use Zend\ServiceManager\Factory\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

/**
 * Index Controller Factory
 *
 * @category  Reliv
 * @author    Westin Shafer <wshafer@relivinc.com>
 * @copyright 2012 Reliv International
 * @license   License.txt New BSD License
 * @version   Release: 1.0
 *
 */
class IndexControllerFactory implements FactoryInterface
{
    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     *
     * @return mixed
     */
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        //$sm = $container->getServiceLocator();
        $config = $container->get('config');
        $ElFinderManager = $container->get('ElFinderManager');

        return new ExtendedElFinderController($config, $ElFinderManager);
    }
}
