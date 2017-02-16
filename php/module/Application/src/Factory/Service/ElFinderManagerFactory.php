<?php
/**
 * ElFinderManager Factory
 *
 * This file contains the Factory of ElFinderManager service.
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
namespace Application\Factory\Service;

use Interop\Container\ContainerInterface;
use Reliv\ElFinder\Service\ElFinderManager;
use Zend\ServiceManager\Factory\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class ElFinderManagerFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        return new ElFinderManager($container);
    }
}
